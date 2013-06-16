(function (a) {
    function g(a, b) {
        var c = a.data("ddTslick");
        var d = a.find(".ddT-selected"),
            e = d.siblings(".ddT-selected-value"),
            f = a.find(".ddT-options"),
            g = d.siblings(".ddT-pointer"),
            h = a.find(".ddT-option").eq(b),
            k = h.closest("li"),
            l = c.settings,
            m = c.settings.data[b];
        a.find(".ddT-option").removeClass("ddT-option-selected");
        h.addClass("ddT-option-selected");
        c.selectedIndex = b;
        c.selectedItem = k;
        c.selectedData = m;
        if (l.showSelectedHTML) {
            d.html((m.imageSrc ? '<img class="ddT-selected-image' + (l.imagePosition == "right" ? " ddT-image-right" : "") + '" src="' + m.imageSrc + '" />' : "") + (m.text ? '<label class="ddT-selected-text">' + m.text + "</label>" : "") + (m.description ? '<small class="ddT-selected-description ddT-desc' + (l.truncateDescription ? " ddT-selected-description-truncated" : "") + '" >' + m.description + "</small>" : ""))
        } else d.html(m.text);
        e.val(m.value);
        c.original.val(m.value);
        a.data("ddTslick", c);
        i(a);
        j(a);
        if (typeof l.onSelected == "function") {
            l.onSelected.call(this, c)
        }
    }
    function h(b) {
        var c = b.find(".ddT-select"),
            d = c.siblings(".ddT-options"),
            e = c.find(".ddT-pointer"),
            f = d.is(":visible");
        a(".ddT-click-off-close").not(d).slideUp(50);
        a(".ddT-pointer").removeClass("ddT-pointer-up");
        if (f) {
            d.slideUp("fast");
            e.removeClass("ddT-pointer-up")
        } else {
            d.slideDown(0);
            e.addClass("ddT-pointer-up")
        }
        k(b)
    }
    function i(a) {
        a.find(".ddT-options").slideUp(50);
        a.find(".ddT-pointer").removeClass("ddT-pointer-up").removeClass("ddT-pointer-up")
    }
    function j(a) {
        var b = a.find(".ddT-select").css("height");
        var c = a.find(".ddT-selected-description");
        var d = a.find(".ddT-selected-image");
        if (c.length <= 0 && d.length > 0) {
            a.find(".ddT-selected-text").css("lineHeight", b)
        }
    }
    function k(b) {
        b.find(".ddT-option").each(function () {
            var c = a(this);
            var d = c.css("height");
            var e = c.find(".ddT-option-description");
            var f = b.find(".ddT-option-image");
            if (e.length <= 0 && f.length > 0) {
                c.find(".ddT-option-text").css("lineHeight", d)
            }
        })
    }
    a.fn.ddTslick = function (c) {
        if (b[c]) {
            return b[c].apply(this, Array.prototype.slice.call(arguments, 1))
        } else if (typeof c === "object" || !c) {
            return b.init.apply(this, arguments)
        } else {
            a.error("Method " + c + " does not exists.")
        }
    };
    var b = {}, c = {
            data: [],
            keepJSONItemsOnTop: false,
            width: 260,
            height: null,
            background: "#eee",
            selectText: "",
            defaultSelectedIndex: null,
            truncateDescription: true,
            imagePosition: "left",
            showSelectedHTML: true,
            clickOffToClose: true,
            onSelected: function () {}}, 
			d = '<div class="ddT-select"><input class="ddT-selected-value" type="hidden" /><a class="ddT-selected"></a><span class="ddT-pointer ddT-pointer-down"></span></div>', 
			e = '<ul class="ddT-options"></ul>', 
			f = '<style id="css-ddTslick" type="text/css">' + 
			".ddT-select{cursor:pointer; height: 25px; border-radius:3px; border:solid 1px #ccc; position:relative; cursor:pointer;}" + 
			".ddT-desc { color:#aaa; display:block; overflow: hidden; font-weight:normal;}" + 
			".ddT-selected{ cursor:pointer; text-align:left; height: 22px; padding-left:5px; padding-right:-5px; padding-top:2px; border-radius:3px; overflow:hidden; display:block;}" + 
			".ddT-pointer{ width:0; height:0; position:absolute; right:10px; top:50%; margin-top:-3px;}" + 
			".ddT-pointer-down{ border:solid 5px transparent; border-top:solid 5px #000; }" + 
			".ddT-pointer-up{border:solid 5px transparent !important; border-bottom:solid 5px #000 !important; margin-top:-8px;}" + 
			".ddT-options{ border:solid 1px #ccc; border-top:none; list-style:none; box-shadow:0px 1px 5px #ddd; display:none; position:absolute; z-index:3000; margin:0; padding:0;background:#fff; overflow:auto; cursor:pointer}" + 
			".ddT-option{ vertical-align:9%; text-align:left; height:23px; padding-left:5px; padding-top:2px; display:block; overflow:hidden; text-decoration:none; color:#333; cursor:pointer;-webkit-transition: all 0.25s ease-in-out; -moz-transition: all 0.25s ease-in-out;-o-transition: all 0.25s ease-in-out;-ms-transition: all 0.25s ease-in-out; }" + 
			".ddT-options > li:last-child > .ddT-option{ cursor:pointer; border-bottom:none;}" + 
			".ddT-option:hover{ cursor:pointer; background:#f3f3f3; color:#000;}" + 
			".ddT-selected-description-truncated { text-overflow: ellipsis; white-space:nowrap; }" + 
			".ddT-option-selected { cursor:pointer; background:#f6f6f6; }" + 
			".ddT-option-image, .ddT-selected-image { vertical-align:middle; float:left; margin-right:5px; max-width:64px;}" + 
			".ddT-image-right { float:right; margin-right:15px; margin-left:5px;}" + 
			".ddT-container{ position:relative;}? .ddT-selected-text { font-weight:bold}?</style>"; 
    if (a("#css-ddTslick").length <= 0) {
        a(f).appendTo("head")
    }
    b.init = function (b) {
        var b = a.extend({}, c, b);
        return this.each(function () {
            var c = a(this),
                f = c.data("ddTslick");
            if (!f) {
                var i = [],
                    j = b.data;
                c.find("option").each(function () {
                    var b = a(this),
                        c = b.data();
                    i.push({
                        text: a.trim(b.text()),
                        value: b.val(),
                        selected: b.is(":selected"),
                        description: c.description,
                        imageSrc: c.imagesrc
                    })
                });
                if (b.keepJSONItemsOnTop) a.merge(b.data, i);
                else b.data = a.merge(i, b.data);
                var k = c,
                    l = a('<div id="' + c.attr("id") + '"></div>');
                c.replaceWith(l);
                c = l;
                c.addClass("ddT-container").append(d).append(e);
                var i = c.find(".ddT-select"),
                    m = c.find(".ddT-options");
                m.css({
                    width: b.width
                });
                i.css({
                    width: b.width,
                    background: b.background
                });
                c.css({
                    width: b.width
                });
                if (b.height != null) m.css({
                        height: b.height,
                        overflow: "auto"
                    });
                a.each(b.data, function (a, c) {
                    if (c.selected) b.defaultSelectedIndex = a;
                    m.append("<li>" + '<a class="ddT-option">' + (c.value ? ' <input class="ddT-option-value" type="hidden" value="' + c.value + '" />' : "") + (c.imageSrc ? ' <img class="ddT-option-image' + (b.imagePosition == "right" ? " ddT-image-right" : "") + '" src="' + c.imageSrc + '" />' : "") + (c.text ? ' <label class="ddT-option-text">' + c.text + "</label>" : "") + (c.description ? ' <small class="ddT-option-description ddT-desc">' + c.description + "</small>" : "") + "</a>" + "</li>")
                });
                var n = {
                    settings: b,
                    original: k,
                    selectedIndex: -1,
                    selectedItem: null,
                    selectedData: null
                };
                c.data("ddTslick", n);
                if (b.selectText.length > 0 && b.defaultSelectedIndex == null) {
                    c.find(".ddT-selected").html(b.selectText)
                } else {
                    var o = b.defaultSelectedIndex != null && b.defaultSelectedIndex >= 0 && b.defaultSelectedIndex < b.data.length ? b.defaultSelectedIndex : 0;
                    g(c, o)
                }
                c.find(".ddT-select").on("click.ddTslick", function () {
                    h(c)
                });
                c.find(".ddT-option").on("click.ddTslick", function () {
                    g(c, a(this).closest("li").index())
                });
                if (b.clickOffToClose) {
                    m.addClass("ddT-click-off-close");
                    c.on("click.ddTslick", function (a) {
                        a.stopPropagation()
                    });
                    a("body").on("click", function () {
                        a(".ddT-click-off-close")
						.slideUp(50).siblings(".ddT-select").find(".ddT-pointer").removeClass("ddT-pointer-up")
                    })
                }
            }
        })
    };
    b.select = function (b) {
        return this.each(function () {
            if (b.index) g(a(this), b.index)
        })
    };
    b.open = function () {
        return this.each(function () {
            var b = a(this),
                c = b.data("ddTslick");
            if (c) h(b)
        })
    };
    b.close = function () {
        return this.each(function () {
            var b = a(this),
                c = b.data("ddTslick");
            if (c) i(b)
        })
    };
    b.destroy = function () {
        return this.each(function () {
            var b = a(this),
                c = b.data("ddTslick");
            if (c) {
                var d = c.original;
                b.removeData("ddTslick").unbind(".ddTslick").replaceWith(d)
            }
        })
    }
})(jQuery)