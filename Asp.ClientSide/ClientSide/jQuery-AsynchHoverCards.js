﻿var widget = {
    Hide: null,
    Clicked: false,
    _init: function () {
        var that = this;
        var viewPromiss;
        var show = false;
        $(document.body).append(that.options.$Container);

        $(that.element).bind('mouseenter', { widget: that }, function (e) {
            widget = e.data.widget;
            widget.ShowContainer();
            if (widget.options.$Content == null) {
                // Insert Loading... text
                widget.options.$Container.html(widet.options.LoadingText);
                var id = widget.element.get(0).id;
                viewPromiss = widget.options.Load(id);
                viewPromiss.done(internalInit);
                viewPromiss.fail(function (jXhr, status) {
                    debug.log("Error: " + status);
                });
                show = true;
            }
        });
        $(that.element).bind('mouseleave', { widget: that }, function (e) {
            if (viewPromiss && viewPromiss.readyState > 0 && viewPromiss.readyState < 4) { // Loading
                viewPromiss.abort();
                debug.log("Aborted");
            }
            show = false;
            widget = e.data.widget;
            widget.Hide = window.setTimeout(CallHideContainer, 100);
        });

        that.options.$Container.bind('mouseenter', { widget: that }, function (e) {
            widget = e.data.widget;
            window.clearTimeout(widget.Hide);
        });

        that.options.$Container.bind('mouseleave', { widget: that }, function (e) {
            widget = e.data.widget;
            if (!widget.Clicked) {
                that.HideContainer();
            }
        });
        that.options.$Container.bind('click', { widget: that }, function (e) {
            widget = e.data.widget;
            window.clearTimeout(widget.Hide);
            widget.Clicked = true
            $(this).addClass(widget.options.cardSelectedCss);
            e.stopPropagation();
        });
        that.options.$Container.bind('clickoutside', { widget: this }, function (e) {
            widget = e.data.widget;
            widget.Clicked = false;
            that.HideContainer();
        });

        function CallHideContainer() {
            that.HideContainer();
        }
        function internalInit(data) {
            debug.log("Inserting " + data.html + " into container");
            that.options.$Content = $(data.html);
            that.options.$Container.html($(data.html));
        }
    },
    HideContainer: function () {
        this.options.$Container.empty();
        this.options.$Content = null;
        this.options.$Container.removeClass(this.options.cardSelectedCss);
        this.options.$Container.css('visibility', 'hidden')
    },
    ShowContainer: function () {
        this.options.$Container.css('visibility', 'visible');
        this.options.$Container.position(widget.GetContainerPosition());

    },
    GetContainerPosition: function () {
        this.options.position.of = this.element;
        return this.options.position;
    },
    options: {
        $Container: $('<div class="dialogbox"></div>'),
        $Content: null,
        LoadingText: 'Loading...',
        Load: null,
        cardSelectedCss: 'cardSelected',
        position: {
            my: "left top",
            at: "left bottom"
        }
    }
}
$.widget('ui.asyncHoverCard', widget);