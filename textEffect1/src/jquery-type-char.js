/**
 * jQuery.typeChar
 * @author Frederick Hamon
 */
(function($){
	'use strict';

	var typeChar = function (options) {
		var timer = null;
		var computedOptions = {};

		var getTiming = function (char) {
			return !char || /\s/.test(char) ? 150 : (~~(Math.random() * 10000) % 30) + 50;
		};

		var animate = function (scope, value, cpt, cb) {
			var nextTiming = getTiming(value.substring(cpt, cpt + 1));
			scope.text(value.substring(0, cpt + 1));

			if (cpt < value.length) {
				clearTimeout(timer);
				timer = setTimeout(function () {
					animate(scope, value, cpt + 1, cb);
				}, nextTiming);
			} else {
				cb();
			}
		};
		
		var computeNode = function (node) {
			if (node.get(0).nodeType !== Node.TEXT_NODE) {
				return node.clone().empty();
			}

			return $('<span />')
					.attr('data-text', node.text())
					.addClass('js-type-char-segment');
		};

		var append = function (scope, context) {
			var node = computeNode(context);
			scope.append(node);
			context.contents().each(function () {
				append(node, $(this));
			});
		};

		var recAnimate = function (elements, index) {
			if (!elements.eq(index).length) {
				if (!!computedOptions.completed  && typeof computedOptions.completed === 'function') {
					computedOptions.completed();
				}
				return;
			}

			animate(elements.eq(index), elements.eq(index).attr('data-text'), 0, function () {
				recAnimate(elements, index + 1);
			});
		};

		var startAnimate = function (scope) {
			append(scope, computedOptions.html);
			recAnimate(scope.find('.js-type-char-segment'), 0);
		};

		return $(this).each(function () {
			var t = $(this);
			computedOptions = $.extend({}, $.typeChar.defaults, options);
			startAnimate(t);
		});
	};

	$.fn.extend({
		typeChar: typeChar
	});

	$.typeChar = {
		defaults: {
			completed: $.noop,
			html: ''
		}
	};

})(jQuery);
