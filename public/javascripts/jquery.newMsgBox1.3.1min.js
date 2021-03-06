// JavaScript Document


var maskDefaultSetting = {
    bgColor: "#000",
    opacity: .6,
    zIndex: 999,
    onClick: null
};
function MaskLayer(g) {
    var c = "100%",
    e = "absolute",
    b = "0px",
    a = this,
    d = a;
    a.settings = $.extend({},
    maskDefaultSetting, g);
    a.maskLayer = $("<div/>", {
        css: {
            background: a.settings.bgColor,
            opacity: a.settings.opacity,
            "z-index": a.settings.zIndex,
            display: "none",
            left: b,
            top: b
        }
    });
    $("body").append(a.maskLayer);
    if ($.browser.msie && $.browser.version == "6.0") {
        a.maskLayer.css({
            position: e
        });
        a.replacement = function() {
            var b = Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth),
            a = Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight);
            d.maskLayer.css({
                width: b + "px",
                height: a + "px"
            })
        };
        var f = $("<iframe/>", {
            css: {
                position: e,
                top: b,
                left: b,
                width: c,
                height: c,
                filter: "alpha(opacity=0)",
                display: "block"
            }
        });
        a.maskLayer.append(f);
        a.settings.onClick && f.contents().click(function() {
            d.settings.onClick()
        })
    } else {
        a.maskLayer.css({
            position: "fixed",
            width: c,
            height: c
        });
        var f = $("<iframe/>", {
            css: {
				position: "fixed",
                top: b,
                left: b,
                width: c,
                height: c,
                filter: "alpha(opacity=0)",
                opacity: 0,
                display: "block"
            }
        });
        a.maskLayer.append(f);
        a.settings.onClick && a.maskLayer.click(function() {
            d.settings.onClick()
        })
    }
}
MaskLayer.prototype.show = function() {
    var a = this,
    b = a;
    if (a.maskLayer.is(":hidden")) {
        if ($.browser.msie && $.browser.version == "6.0") {
            $(window).bind("resize.maskLayer", 
            function() {
                b.replacement()
            });
            a.replacement()
        }
        a.maskLayer.fadeIn("fast")
    }
};
MaskLayer.prototype.hide = function() {
    if (this.maskLayer.is(":visible")) {
        this.maskLayer.fadeOut("fast");
        $(window).unbind("resize.maskLayer")
    }
};
var msgboxDefaultSetting = {
    title: null,
    closeExist: true,
    skin: "msg_table",
    isFixed: true,
    position: {
        x: "center",
        y: "center"
    },
    masklayer: {
        bgColor: "#000",
        opacity: .3
    },
    zIndex: 999,
    shadow: false,
    existTime: null,
    content: null,
    width: "auto",
    height: "auto",
    btns: null,
    maskOnClick: null,
    onClose: null
};
function setPostion() {
    var c = "center",
    a = this,
    b = a.settings.position,
    d = 0,
    e = 0;
    if ($.browser.msie && $.browser.version == "6.0" || a.settings.isFixed == false) {
        d = b.x == c ? $(document).scrollLeft() + ($(window).width() - a.msgbox.width()) / 2: $(document).scrollLeft() + parseInt(b.x);
        e = b.y == c ? $(document).scrollTop() + ($(window).height() - a.msgbox.height()) / 2: $(document).scrollTop() + parseInt(b.y);
		if(e<10){
			e=10;
		}
    } else {
        d = b.x == c ? ($(window).width() - a.msgbox.width()) / 2: parseInt(b.x);
        e = b.y == c ? ($(window).height() - a.msgbox.height()) / 2: parseInt(b.y)
    }
    a.msgbox.css({"left": d + "px","top": e + "px"});
}
function MsgBox(k) {
    var c = "<div>",
    g = "javascript:void(0)",
    a = this,
    m = a;
    a.settings = $.extend(true, {},
    msgboxDefaultSetting, k);
    var l = !($.browser.msie && $.browser.version == "6.0") && a.settings.isFixed ? "fixed": "absolute";
    a.msgbox = $("<div/>", {
        css: {
            position: l,
            "z-index": a.settings.zIndex + 1,
            display: "none"
        }
    });
    $("body").append(a.masklayer).append(a.msgbox);

    a.settings.shadow && a.msgbox.addClass("msg_shadow");
    if (a.settings.masklayer) a.maskLayer = new MaskLayer({
        bgColor: a.settings.masklayer.bgColor,
        opacity: a.settings.masklayer.opacity,
        zIndex: a.settings.zIndex,
        onClick: a.settings.maskOnClick
    });
	var f = $("<table>", {
		cellpadding: "0",
		cellspacing: "0",
		border: "0",
		"class": a.settings.skin
	}),
	e = $("<tr/>");
    e.append('<td class="msg_background_horn msg_top_left">&nbsp;</td>');
    e.append('<td class="msg_top_center">&nbsp;</td>');
    var j = $("<td>", {
        "class": "msg_background_horn msg_top_right"
    });
    e.append(j);

    f.append(e);
    var d = $("<tr/>");
    d.append('<td class="msg_content_left">&nbsp;</td>');

	var b = $("<td>", {
		"class": "msg_content"
	});
	    if (a.settings.closeExist) {
        var i = $("<a>", {
            href: g,
            "class": "msg_close_btn"
        });
        b.append(i);
        i.click(function() {
            m.hide()
        })
    }var ex = $("<div>", {
		"class": "msg_content_big"
	});
    b.append(ex);
    a.settings.title && ex.append('<div class="msg_title">' + a.settings.title + "</div>");
    contentInner = $(c, {
        css: {
            width: typeof a.settings.width == "string" ? a.settings.width: a.settings.width + "px",
            height: typeof a.settings.height == "string" ? a.settings.height: a.settings.height + "px"
        }
    });
    ex.append(contentInner);
    contentInner.append(a.settings.content);
    proxy = null;
    if (a.settings.btns) {
        var h = $(c, {
            "class": "msg_btns_container"
        });
        $.each(a.settings.btns, 
        function() {
            var a = this,
            e = a,
            b = $(c, {
                "class": "msg_tc"
            });
            a.style && typeof a.style == "object" ? b.css(a.style) : b.addClass(a.style);
			
			if(a.ads){
				var d = $("<a>", {
					href: g,
					"class": a.ads
				});
			}else{
				var d = $("<a>", {
					href: g,
					"class": "msg_bt_sure"
				});
			}
            e.onClick && d.click(function() {
                e.onClick();
                if ($.browser.msie && $.browser.version == "6.0") return false
            });
            d.append($("<span>", {
                text: a.text
            }));
            b.append(d);
            h.append(b)
        });
        ex.append(h)
    }
    d.append(b);
    d.append('<td class="msg_content_right">&nbsp;</td>');
    f.append(d);
    f.append('<tr><td class="msg_background_horn msg_bottom_left">&nbsp;</td><td class="msg_bottom_center">&nbsp;</td><td class="msg_background_horn msg_bottom_right">&nbsp;</td></tr>');
    a.msgbox.append(f)
}
MsgBox.prototype.show = function() {
    var a = this,
    b = a;
    if (a.msgbox.is(":hidden")) {
        $(window).bind("resize.msgBox", 
        function() {
            setPostion.call(b)
        });
        if ($.browser.msie && $.browser.version == "6.0" && a.settings.isFixed) {
            var d = a.settings.shadow ? a.msgbox.width() - 5: a.msgbox.width(),
            c = a.settings.shadow ? a.msgbox.height() - 5: a.msgbox.height();
            a.msgbox.css({
                width: d + "px",
                height: c + "px"
            });
            $(window).bind("scroll.msgBox", 
            function() {
                setTimeout(function() {
                    setPostion.call(b)
                },
                160)
            })
        }
        setPostion.call(a);
        a.settings.masklayer && a.maskLayer.show();
        a.msgbox.show();
        a.settings.existTime && setTimeout(function() {
            b.hide()
        },
        a.settings.existTime)
    }
};
MsgBox.prototype.hide = function() {
    var a = this;
    if (a.msgbox.is(":visible")) {
        a.settings.onClose && a.settings.onClose();
        a.settings.masklayer && a.maskLayer.hide();
        a.msgbox.fadeOut("fast");
        $(window).unbind("resize.msgBox");
        $.browser.msie && $.browser.version == "6.0" && a.settings.isFixed && $(window).unbind("scroll.msgBox")
    }
}

MsgBox.prototype.showMasklayer=function(){
	var a=this;
	a.settings.masklayer && a.maskLayer.show();
}
MsgBox.prototype.hideMasklayer=function(){
	var a=this;
	a.settings.masklayer && a.maskLayer.hide();
}


