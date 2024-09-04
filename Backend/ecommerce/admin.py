from django.contrib import admin

from ecommerce import models


@admin.register(models.Mobile)
class MobileAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "display_price", "buy_price", "get_tags", "brand", "get_color", "processor", "ram", "ram_unit")
    list_filter = ("name", "tags", "buy_price", "display_price", "brand", "color", "processor", "ram", "ram_unit")

    def get_tags(self, obj):
        return "\n".join([t.name for t in obj.tags.all()])
    
    def get_color(self, obj):
        return "\n".join([c.name for c in obj.color.all()])


admin.site.register(models.Tag)
admin.site.register(models.ScreenType)
admin.site.register(models.Brand)
admin.site.register(models.Color)
admin.site.register(models.RamUnit)
admin.site.register(models.UsbPort)
admin.site.register(models.ImageStorage)
admin.site.register(models.MobileImage)
