; (function ($, window, document) {

  //defaults value
  var defaults = {
    'width' : 1024,
    'next' : '<span class="arrow">&rsaquo;</span>',
    'prev' : '<span class="back-arrow">&lsaquo;</span>',
    'linkSwitch' : false,
    'showParent': true,
    'backButtonText': 'Назад'
  };

  function MultiMenu (element, options) {
    //vars block
    this.options = $.extend({}, defaults, options);
    this.element = element;
    this.init();
  }

  //call init function
  MultiMenu.prototype.init = function () {

        var self = this,
          element = this.element,
          attrId = element.attr('id'),
          attrClass = element.attr('class'),
          menuEnabled = false;

        //add Overlay
        $('body').append('<div class="multilevelOverlay js-overlay"></div>');

        //create animate-menu function
        function openMenu() {
          $('body').toggleClass('bodyFixed');
          setTimeout(function() {
            $('.multilevelMenu ul').attr('class', '');
          }, 400);
        }

        //swipe function for open menu
        function SwipeOpenMenu() {
          //create swipe-selector
          if ($('.multilevelMenu').length > 0) {
            $('body').append('<span class="js-swipe"></span>');
            var touchstartX = 0,
                touchendX = 0;
            // open menu on tap swipe
            $('.js-swipe, .multilevelMenu').on('touchstart', function(e) {
              touchstartX = e.originalEvent.changedTouches[0].pageX;
            });

            $('.js-swipe').on('touchend', function (e) {
              touchendX = e.originalEvent.changedTouches[0].pageX;
              if (touchendX > touchstartX) {
                //call animate-menu function
                openMenu();
              }
            });

            //close menu left-swipe
            $('.multilevelMenu').on('touchend', function (e) {
              touchendX = e.originalEvent.changedTouches[0].pageX;
              if (touchendX < (touchstartX - 20)) {
                $('body').removeClass('bodyFixed');
                setTimeout(function () {
                  $('.multilevelMenu ul').attr('class', '');
                }, 400);
              }
            });
          } else {
            return false;
          }

        }


        //create work-menu function
        function mobileMenu() {

          var w = window.innerWidth ? window.innerWidth : $(window).width();

          //next level function
          function nextLevelFunction (e, el) {
            e.preventDefault();
            e.stopPropagation();
            el.parents('ul').addClass('close-list');
            el.closest('li').children('ul').addClass('active-menu');
          }

          //add text for prev button function
          function textPrevButton (str, el) {
            if (str.length > 0) {
              str = str.substring(0, str.length - 1);
            }
            el.closest('li').find('li.back').text(str);
            $('.js-back').append(self.options.prev);
          }

          if (w < self.options.width) {
            //remove attr
             if (!menuEnabled) {
                  menuEnabled = true;
                  element.removeAttr('id');
                  element.removeClass();
                  element.addClass('multilevelMenu');
                  //call swipe function
                  SwipeOpenMenu();
                  //add switch-button for children ul
                  var link = element.find('a');
                  link.append(function(indx, val) {
                    var out = '';
                    if($(this).parent('li').find('ul').length > 0) {
                      out = self.options.next;
                    }
                    return $(out).addClass('js-arrow');
                  });
                  //add back-button function
                  element.find('li').find('ul').prepend('<li class="back js-back"></li>');

                  //view next level menu full button
                  if (self.options.linkSwitch == true) {

                    $(link).on("click", function (e) {
                      if ($(this).next('ul').length > 0) {
                        nextLevelFunction (e, $(this));
                      }
                      //name prev-button text
                      var str = $(this).text();
                      textPrevButton (str, $(this));
                    });

                  } else {

                    //view next level menu on only arrow
                    $(link).on("click", ".js-arrow", function (e) {
                      nextLevelFunction (e, $(this));
                      //name prev-button text
                      var str = $(this).parents('a').text();
                      textPrevButton (str, $(this));
                    });

                  }

                  //view prev level menu to click "back"
                  $('.js-back').click(function () {
                    $(this).closest('ul.close-list').removeClass('close-list');
                    $(this).closest('ul').addClass('hidden-menu');
                    var that = this;
                    setTimeout(function () {
                      $(that).closest('ul').removeClass('active-menu hidden-menu');
                    }, 400);
                  });

              }
          } else  {
             if (menuEnabled) {
                //return attr
                menuEnabled = false;
                element.attr('id', attrId);
                element.attr('class', attrClass);
                $('.js-arrow, .js-back, .js-swipe').detach();
              }

              $('body').removeClass('bodyFixed'); //remove fixedClass to body
              element.find('ul').removeClass();
            }
        }

        //call work-menu function
        mobileMenu();

        //remove attr resize
        $(window).resize(function () {
          //call work-menu function
          mobileMenu();
        });

        //animate menu function Call
        $('.js-toggle').add($('.js-overlay')).on("click", function () {
            //call animate-menu function
            openMenu();
        });

  };

  $.fn.mobileMenu = function (options) {
    new MultiMenu(this.first(), options);
    return this.first();
  };

})(jQuery, window, document);
