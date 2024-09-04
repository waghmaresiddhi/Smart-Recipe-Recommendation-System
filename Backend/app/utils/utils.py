import json
import os
from collections import OrderedDict
from time import time
from rest_framework import parsers
from rest_framework.pagination import PageNumberPagination


def timer_func(func):
    # This function shows the execution time of
    # the function object passed
    def wrap_func(*args, **kwargs):
        t1 = time()
        result = func(*args, **kwargs)
        t2 = time()
        print(f"Function {func.__name__!r} executed in {(t2 - t1):.4f}s")
        return result

    return wrap_func


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 1000


class MultipartJsonParser(parsers.MultiPartParser):
    def parse(self, stream, media_type=None, parser_context=None):
        result = super().parse(
            stream,
            media_type=media_type,
            parser_context=parser_context
        )
        data = {}
        # for case1 with nested serializers
        # parse each field with json
        for key, value in result.data.items():
            if type(value) != str:
                # For multipart file
                data[key] = value
                continue
            if '{' in value or "[" in value:
                # For json
                try:
                    data[key] = json.loads(value)
                except ValueError:
                    data[key] = value
            else:
                # For string
                if value == '':
                    data[key] = None
                else:
                    data[key] = value
        
        order_dict = OrderedDict()
        order_dict.update(data)
        return parsers.DataAndFiles(order_dict, result.files)


def _delete_file(path):
    if os.path.isfile(path):
        os.remove(path)
