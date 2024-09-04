from rest_framework.permissions import BasePermission


class IsObjOwnerPermission(BasePermission):
    message = "You cant access this data"

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user
