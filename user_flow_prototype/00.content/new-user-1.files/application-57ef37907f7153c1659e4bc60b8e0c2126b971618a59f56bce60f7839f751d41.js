Function.prototype.bind||(Function.prototype.bind=function(t){if("function"!=typeof this)throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");var e=Array.prototype.slice.call(arguments,1),i=this,n=function(){},s=function(){return i.apply(this instanceof n&&t?this:t,e.concat(Array.prototype.slice.call(arguments)))};return n.prototype=this.prototype,s.prototype=new n,s}),"undefined"==typeof window.GOVUK&&(window.GOVUK={}),"undefined"==typeof window.GOVUK.support&&(window.GOVUK.support={}),window.GOVUK.support.history=function(){return window.history&&window.history.pushState&&window.history.replaceState},function(){"use strict";function t(t){0!==t.$el.length&&GOVUK.support.history()&&(e(window).width()<640||(this.$el=t.$el,this.$root=this.$el.find("#root"),this.$section=this.$el.find("#section"),this.$subsection=this.$el.find("#subsection"),this.$breadcrumbs=e(".govuk-breadcrumbs"),this.animateSpeed=330,0===this.$section.length&&(this.$section=e('<div id="section" class="section-pane pane with-sort" />'),this.$el.prepend(this.$section),this.$el.addClass("section")),0===this.$subsection.length?(this.$subsection=e('<div id="subsection" class="subsection-pane pane" />').hide(),this.$el.prepend(this.$subsection)):this.$subsection.show(),this.displayState=this.$el.data("state"),"undefined"==typeof this.displayState&&(this.displayState="root"),this._cache={},this.lastState=this.parsePathname(window.location.pathname),this.$el.on("click","a",this.navigate.bind(this)),e(window).on("popstate",this.popState.bind(this))))}window.GOVUK=window.GOVUK||{};var e=window.jQuery;t.prototype={popState:function(t){var e,i=t.originalEvent.state;i||(i=this.parsePathname(window.location.pathname)),this.lastState.slug!==i.slug&&(e=""==i.slug?this.showRoot():i.subsection?this.restoreSubsection(i):this.loadSectionFromState(i,!0),e.then(function(){this.trackPageview(i)}.bind(this)))},restoreSubsection:function(t){if(this.lastState.section!=t.section){var e=window.location.pathname.split("/").slice(0,-1).join("/"),i=this.parsePathname(e);return this.loadSectionFromState(i,!0).then(function(){return this.loadSectionFromState(t,!0)}.bind(this))}return this.loadSectionFromState(t,!0)},sectionCache:function(t,e,i){return"undefined"==typeof i?this._cache[t+e]:void(this._cache[t+e]=i)},isDesktop:function(){return e(window).width()>768},showRoot:function(){this.$section.html(""),this.displayState="root",this.$root.find("h1").focus();var t=new e.Deferred;return t.resolve()},showSection:function(t){t.title=this.getTitle(t.slug),this.setTitle(t.title),this.$section.html(t.sectionData.html),this.highlightSection("root",t.path),this.removeLoading(),this.updateBreadcrumbs(t);var i;return"subsection"===this.displayState?i=this.animateSubsectionToSectionDesktop():"root"===this.displayState?i=this.animateRootToSectionDesktop():(i=new e.Deferred,i.resolve()),i.then(function(){this.$section.find("h1").focus()}.bind(this))},animateSubsectionToSectionDesktop:function(){function t(){this.displayState="section",this.$el.removeClass("subsection").addClass("section"),this.$section.attr("style",""),this.$section.find(".pane-inner").attr("style",""),this.$section.addClass("with-sort"),this.$root.attr("style",""),i.resolve()}var i=new e.Deferred;if(this.$root.css({position:"absolute",width:this.$root.width()}),this.$subsection.hide(),this.$section.css("margin-right","63%"),this.isDesktop()){this.$section.find(".pane-inner.curated").animate({paddingLeft:"30px"},this.animateSpeed),this.$section.find(".pane-inner.alphabetical").animate({paddingLeft:"96px"},this.animateSpeed);var n={width:"35%",marginLeft:"0%",marginRight:"40%"}}else var n={width:"30%",marginLeft:"0%",marginRight:"45%"};return this.$section.animate(n,this.animateSpeed,t.bind(this)),i},animateRootToSectionDesktop:function(){var t=new e.Deferred;return this.displayState="section",this.$el.removeClass("subsection").addClass("section"),t.resolve()},showSubsection:function(t){t.title=this.getTitle(t.slug),this.setTitle(t.title),this.$subsection.html(t.sectionData.html),this.highlightSection("section",t.path),this.highlightSection("root","/browse/"+t.section),this.removeLoading(),this.updateBreadcrumbs(t);var i;return"subsection"!==this.displayState?i=this.animateSectionToSubsectionDesktop():(i=new e.Deferred,i.resolve()),i.then(function(){this.$subsection.find("h1").focus()}.bind(this))},animateSectionToSubsectionDesktop:function(){var t=new e.Deferred;if(this.$root.css({position:"absolute",width:this.$root.width()}),this.$section.find(".sort-order").hide(),this.$section.find(".pane-inner").animate({paddingLeft:"0"},this.animateSpeed),this.isDesktop())var i={width:"25%",marginLeft:"-13%",marginRight:"63%"};else var i={width:"30%",marginLeft:"-18%",marginRight:"63%"};return this.$section.animate(i,this.animateSpeed,function(){this.$el.removeClass("section").addClass("subsection"),this.$subsection.show(),this.$section.removeClass("with-sort"),this.displayState="subsection",this.$section.find(".sort-order").attr("style",""),this.$section.attr("style",""),this.$section.find(".pane-inner").attr("style",""),this.$root.attr("style",""),t.resolve()}.bind(this)),t},getTitle:function(t){var e=this.$el.find('a[href$="/browse/'+t+'"]:first'),i=e.find("h3");return i.length>0?i.text():e.text()},setTitle:function(t){e("title").text(t)},addLoading:function(t){this.$el.attr("aria-busy","true"),t.addClass("loading")},removeLoading:function(){this.$el.attr("aria-busy","false"),this.$el.find("a.loading").removeClass("loading")},getSectionData:function(t){var i=this.sectionCache("section",t.slug),n=new e.Deferred,s="/browse/"+t.slug+".json";return"undefined"!=typeof t.sectionData?n.resolve(t.sectionData):"undefined"!=typeof i?n.resolve(i):e.ajax({url:s}).then(function(e){this.sectionCache("section",t.slug,e),n.resolve(e)}.bind(this)),n},highlightSection:function(t,e){this.$el.find("#"+t+" .active").removeClass("active"),this.$el.find('a[href$="'+e+'"]').parent().addClass("active")},parsePathname:function(t){var e={path:t,slug:t.replace(/\/browse\/?/,"")};return e.slug.indexOf("/")>-1?(e.section=e.slug.split("/")[0],e.subsection=e.slug.split("/")[1]):e.section=e.slug,e},scrollToBrowse:function(){var t=e("body"),i=this.$el.offset().top;t.scrollTop()>i&&e("body").animate({scrollTop:i},this.animateSpeed)},loadSectionFromState:function(t,i){var n=this.getSectionData(t);if(t.subsection){var s=n;n=e.when(s)}return n.then(function(e){return t.sectionData=e,this.scrollToBrowse(),this.lastState=t,t.subsection?this.showSubsection(t):this.showSection(t)}.bind(this)).then(function(){"undefined"==typeof i&&(history.pushState(t,"",t.path),this.trackPageview(t))}.bind(this))},navigate:function(t){if(t.currentTarget.pathname.match(/^\/browse\/[^\/]+(\/[^\/]+)?$/)){var i=e(t.currentTarget);if(i.hasClass("ab-test-redirect"))return;t.preventDefault();var n=this.parsePathname(t.currentTarget.pathname);if(n.title=i.text(),n.path===window.location.pathname)return;this.addLoading(i),this.loadSectionFromState(n)}},updateBreadcrumbs:function(t){var i=e(t.sectionData.breadcrumbs);this.$breadcrumbs.html(i.html())},trackPageview:function(t){var e=this.$section.find("h1").text();e=e?e.toLowerCase():"browse",GOVUK.analytics&&GOVUK.analytics.trackPageview&&GOVUK.analytics.trackPageview(t.path,null,{dimension1:e})}},GOVUK.BrowseColumns=t,e(function(){GOVUK.browseColumns=new t({$el:e(".browse-panes")})})}(),function(t){"use strict";t.GOVUK=t.GOVUK||{},t.GOVUK.getCurrentLocation=function(){return t.location}}(window),window.GOVUK.Modules=window.GOVUK.Modules||{},function(t){"use strict";t.AccordionWithDescriptions=function(){function t(t){function i(){o(!0)}function n(){o(!1)}function s(){o(r())}function o(i){t.toggleClass("subsection-is-open",i),u.toggleClass("js-hidden",!i),h.attr("aria-expanded",i),d&&e(t)}function a(){return t.hasClass("subsection-is-open")}function r(){return!a()}function c(){d=!1}function l(){return u.find("li").length}var h=t.find(".js-subsection-title-link"),u=t.find(".js-subsection-content"),d=!0;this.title=t.find(".js-subsection-title").text(),this.href=h.attr("href"),this.element=t,this.open=i,this.close=n,this.toggle=s,this.setIsOpen=o,this.isOpen=a,this.isClosed=r,this.preventHashUpdate=c,this.numberOfContentItems=l}function e(e){var n=new t(e),s=n.isOpen()&&"#"+e.attr("id");i(s)}function i(t){if(GOVUK.support.history()){var e=t||GOVUK.getCurrentLocation().pathname;history.replaceState({},"",e)}}function n(t,e,i){function n(){i.track("pageElementInteraction",a(),{label:s()}),t.isClosed()||i.track("navAccordionLinkClicked",String(o()),{label:t.href,dimension28:String(t.numberOfContentItems()),dimension29:t.title})}function s(){return o()+". "+t.title}function o(){return e.index(t.element)+1}function a(){return t.isClosed()?"accordionClosed":"accordionOpened"}this.track=n}function s(t){this.track=function(e,i,n){GOVUK.analytics&&GOVUK.analytics.trackEvent&&(n=n||{},n.dimension28=t.toString(),GOVUK.analytics.trackEvent(e,i,n))}}var o={openAll:{buttonText:"Expand all",eventLabel:"Open All"},closeAll:{buttonText:"Close all",eventLabel:"Close All"}};this.start=function(e){function a(){h();var t=f();document.body.scrollTop=t&&t.length?t.offset().top:0}function r(){e.prepend('<div class="subsection-controls js-subsection-controls"><button aria-expanded="false">'+o.openAll.buttonText+"</button></div>")}function c(){C.append('<span class="subsection-icon"></span>')}function l(){for(var t="",i=0;k>i;i++)t+="subsection_content_"+i+" ";y=e.find(".js-subsection-controls button"),y.attr("aria-controls",t)}function h(){u(!1)}function u(e){$.each(O,function(){var i=new t($(this));i.preventHashUpdate(),i.setIsOpen(e)})}function d(){var e=f();if(e&&e.length){var i=new t(e);i.open()}}function f(){var t=p();return t.length?e.find("#"+S(t.substr(1))):null}function p(){return GOVUK.getCurrentLocation().hash}function b(){$.each(O,function(){var t=$(this),e=t.attr("id"),i=t.find(".js-subsection-title"),n=t.find(".js-subsection-content").first().attr("id");i.wrap('<a class="subsection-title-link js-subsection-title-link" href="#'+e+'" aria-controls="'+n+'"></a>')})}function w(i){e.find(".js-subsection-header").click(function(e){g(e);var s=new t($(this).closest(".js-subsection"));s.toggle();var o=new n(s,O,i);o.track(),v()})}function g(t){t.metaKey||t.ctrlKey||t.preventDefault()}function m(t){y=e.find(".js-subsection-controls button"),y.on("click",function(){var e;return y.text()==o.openAll.buttonText?(y.text(o.closeAll.buttonText),e=!0,t.track("pageElementInteraction","accordionAllOpened",{label:o.openAll.eventLabel})):(y.text(o.openAll.buttonText),e=!1,t.track("pageElementInteraction","accordionAllClosed",{label:o.closeAll.eventLabel})),u(e),y.attr("aria-expanded",e),v(),i(null),!1})}function v(){var t=e.find(".subsection-is-open").length;t===k?y.text(o.closeAll.buttonText):y.text(o.openAll.buttonText)}function S(t){var e=/([\x00-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;return t.replace(e,"\\$&")}$(window).unload(a),e.addClass("js-accordion-with-descriptions"),e.removeClass("js-hidden");var y,O=e.find(".js-subsection"),C=e.find(".subsection-header"),k=e.find(".subsection-content").length,x=new s(k);b(),r(),c(),l(),h(),d(),w(x),m(x)}}}(window.GOVUK.Modules),function(){"use strict";window.GOVUK=window.GOVUK||{},window.GOVUK.feeds={init:function(){$(".js-feed").on("click",window.GOVUK.feeds.toggle)},toggle:function(t){t.preventDefault();var e=$(t.target).siblings(".js-feed-panel");e.toggle(),e.find("input").select()}},$(function(){GOVUK.feeds.init()})}();