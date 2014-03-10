(function (a) {
    function g(a, b) {
        var c = a.data("ddCslick");
        var d = a.find(".ddC-selected"),
            e = d.siblings(".ddC-selected-value"),
            f = a.find(".ddC-options"),
            g = d.siblings(".ddC-pointer"),
            h = a.find(".ddC-option").eq(b),
            k = h.closest("li"),
            l = c.settings,
            m = c.settings.data[b];
        a.find(".ddC-option").removeClass("ddC-option-selected");
        h.addClass("ddC-option-selected");
        c.selectedIndex = b;
        c.selectedItem = k;
        c.selectedData = m;
        if (l.showSelectedHTML) {
            d.html((m.imageSrc ? '<img class="ddC-selected-image' + (l.imagePosition == "right" ? " ddC-image-right" : "") + '" src="' + m.imageSrc + '" />' : "") + (m.text ? '<label class="ddC-selected-text">' + m.text + "</label>" : "") + (m.description ? '<small class="ddC-selected-description ddC-desc' + (l.truncateDescription ? " ddC-selected-description-truncated" : "") + '" >' + m.description + "</small>" : ""))
        } else d.html(m.text);
        e.val(m.value);
        c.original.val(m.value);
        a.data("ddCslick", c);
        i(a);
        j(a);
        if (typeof l.onSelected == "function") {
            l.onSelected.call(this, c)
        }
    }
    function h(b) {
        var c = b.find(".ddC-select"),
            d = c.siblings(".ddC-options"),
            e = c.find(".ddC-pointer"),
            f = d.is(":visible");
        //a(".ddC-click-off-close").not(d);
		//.slideUp(50);
        a(".ddC-pointer").removeClass("ddC-pointer-up");
        if (f) {
            //d.slideUp("fast");
            e.removeClass("ddC-pointer-up")
        } else {
            d.slideDown(0);
            e.addClass("ddC-pointer-up")
        }
        k(b)
    }
    function i(a) {
        //a.find(".ddC-options")
		//.slideUp(50);
        a.find(".ddC-pointer").removeClass("ddC-pointer-up").removeClass("ddC-pointer-up")
    }
    function j(a) {
        var b = a.find(".ddC-select").css("height");
        var c = a.find(".ddC-selected-description");
        var d = a.find(".ddC-selected-image");
        if (c.length <= 0 && d.length > 0) {
            a.find(".ddC-selected-text").css("lineHeight", b)
        }
    }
    function k(b) {
        b.find(".ddC-option").each(function () {
            var c = a(this);
            var d = c.css("height");
            var e = c.find(".ddC-option-description");
            var f = b.find(".ddC-option-image");
            if (e.length <= 0 && f.length > 0) {
                c.find(".ddC-option-text").css("lineHeight", d)
            }
        })
    }
    a.fn.ddCslick = function (c) {
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
            onSelected: function () {}
        }, d = '<div class="ddC-select"><input class="ddC-selected-value" type="hidden" /><a class="ddC-selected"></a><span class="ddC-pointer ddC-pointer-down"></span></div>',
        e = '<ul class="ddC-options"></ul>',
        f = '<style id="css-ddCslick" type="text/css">' + 
		".ddC-select{ border-radius:5px; border:solid 1px #ccc; position:relative; cursor:pointer;}" + 
		".ddC-desc {font-size:88%; color:#777; display:block; overflow: hidden; font-weight:normal; line-height: 1.5em; }" + 
		".ddC-selected{border-radius:5px; background:#fff; border:solid 2px #60a0bf; height: 34px; line-height: 1.5em; overflow:hidden; display:block; padding:8px; font-weight:bold;}" + 
		".ddC-pointer{ display:none; width:0; height:0; position:absolute; right:10px; top:50%; margin-top:-3px;}" + 
		".ddC-pointer-down{ border:solid 5px transparent; border-top:solid 5px #000; }" + 
		".ddC-pointer-up{border:solid 5px transparent !important; border-bottom:solid 5px #000 !important; margin-top:-8px;}" + 
		".ddC-options{ border:solid 1px #ccc; list-style:none; box-shadow:0px 1px 5px #ddd; display:none; position:absolute; z-index:2000; margin-top:8px; padding:0;background:#fff; overflow:auto;}" + 
		".ddC-option{padding:5px 8px; display:block; border-bottom:solid 1px #ddd; overflow:hidden; text-decoration:none; color:#111; cursor:pointer;-webkit-transition: all 0.25s ease-in-out; -moz-transition: all 0.25s ease-in-out;-o-transition: all 0.25s ease-in-out;-ms-transition: all 0.25s ease-in-out; }" + 
		".ddC-options > li:last-child > .ddC-option{ border-bottom:none;}" + 
		".ddC-option:hover{ background:#f3f3f3; color:#000;}" + 
		".ddC-selected-description-truncated { text-overflow: ellipsis; white-space:nowrap; }" + 
		".ddC-option-selected { background:#f6f6f6; }" + 
		".ddC-option-image, .ddC-selected-image { vertical-align:middle; float:left; margin-right:5px; max-width:64px;}" + 
		".ddC-image-right { float:right; margin-right:15px; margin-left:5px;}" + 
		".ddC-container{ position:relative;}? .ddC-selected-text { font-weight:bold}?</style>";
    if (a("#css-ddCslick").length <= 0) {
        a(f).appendTo("head")
    }
    b.init = function (b) {
        var b = a.extend({}, c, b);
        return this.each(function () {
            var c = a(this),
                f = c.data("ddCslick");
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
                c.addClass("ddC-container").append(d).append(e);
                var i = c.find(".ddC-select"),
                    m = c.find(".ddC-options");
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
                    m.append("<li>" + '<a class="ddC-option">' + (c.value ? ' <input class="ddC-option-value" type="hidden" value="' + c.value + '" />' : "") + (c.imageSrc ? ' <img class="ddC-option-image' + (b.imagePosition == "right" ? " ddC-image-right" : "") + '" src="' + c.imageSrc + '" />' : "") + (c.text ? ' <label class="ddC-option-text">' + c.text + "</label>" : "") + (c.description ? ' <small class="ddC-option-description ddC-desc">' + c.description + "</small>" : "") + "</a>" + "</li>")
                });
                var n = {
                    settings: b,
                    original: k,
                    selectedIndex: -1,
                    selectedItem: null,
                    selectedData: null
                };
                c.data("ddCslick", n);
                if (b.selectText.length > 0 && b.defaultSelectedIndex == null) {
                    c.find(".ddC-selected").html(b.selectText)
                } else {
                    var o = b.defaultSelectedIndex != null && b.defaultSelectedIndex >= 0 && b.defaultSelectedIndex < b.data.length ? b.defaultSelectedIndex : 0;
                    g(c, o)
                }
                c.find(".ddC-select").on("click.ddCslick", function () {
                    h(c)
                });
                c.find(".ddC-option").on("click.ddCslick", function () {
                    g(c, a(this).closest("li").index())
                });
                if (b.clickOffToClose) {
                    m.addClass("ddC-click-off-close");
                    c.on("click.ddCslick", function (a) {
                        a.stopPropagation()
                    });
                    a("body").on("click", function () {
                        //a(".ddC-click-off-close")
						//.slideUp(50).siblings(".ddC-select").find(".ddC-pointer").removeClass("ddC-pointer-up")
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
                c = b.data("ddCslick");
            if (c) h(b)
        })
    };
    b.close = function () {
        return this.each(function () {
            var b = a(this),
                c = b.data("ddCslick");
            if (c) i(b)
        })
    };
    b.destroy = function () {
        return this.each(function () {
            var b = a(this),
                c = b.data("ddCslick");
            if (c) {
                var d = c.original;
                b.removeData("ddCslick").unbind(".ddCslick").replaceWith(d)
            }
        })
    }
})(jQuery)