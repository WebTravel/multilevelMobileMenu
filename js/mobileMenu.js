//version 1.0.5 - рефакторинг, изменение стилей, сброс ненужных классов ul, li, a
//version 1.0.6 - рефакторинг, изменение стилей, сброс ненужных классов em
//version 1.0.7 - отображение текста названия раздела вместо кнопки "Назад"
//version 1.0.8 - сброс всех аттрибутов, кроме class="multilevelMenu" при ширине менее 1024px
//version 1.1 - преобразование всего меню в плагин
//version 1.1.1 - добавление стрелки (arrow) и кнопки "Назад" (back) только после перехода на необходимую ширину
//version 1.2 - добавление touch событий. На swipe меню выдвигается
//version 1.2.1 - глобальное изменение стилей

; (function ($, window, document) {

  //defaults value
  var defaults = {
    'width' : 1024,
    'next' : '<span class="arrow">&rsaquo;</span>',
    'prev' : '<span class="back-arrow">&lsaquo;</span>'
  };



  $.fn.mobileMenu = function (options) {

    //vars block
    var config = $.extend({}, defaults, options),
        element = this.first(),
        attrId = element.attr('id'),
        attrClass = element.attr('class'),
        menuEnabled = false;


    element.init = function () {

      var self = this;

      //add Overlay
      $('body').append('<div class="multilevelOverlay js-overlay"></div>');


      //create animate-menu function
      function openMenu() {
        $('body').toggleClass('bodyFixed');
        setTimeout(function() {
          $('.close-list').removeClass('close-list');
        }, 400);
      }


      //swipe function for open menu
      function SwipeOpenMenu() {
        //create swipe-element
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
              openMenu();
            }
          });


          $('.multilevelMenu').on('touchend', function (e) {
            touchendX = e.originalEvent.changedTouches[0].pageX;
            if (touchendX < touchstartX) {
              $('body').removeClass('bodyFixed');
              setTimeout(function () {
                $('.close-list').removeClass('close-list');
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
        if (w < config.width) {
          //remove attr
           if (!menuEnabled) {
                menuEnabled = true;
                self.removeAttr('id');
                self.removeClass();
                self.addClass('multilevelMenu');
                //call swipe function
                SwipeOpenMenu();
                //add switch-button for children ul
                var link = element.find('a');
                link.append(function(indx, val) {
                  var out = '';
                  if($(this).parent('li').find('ul').length > 0) {
                    out = config.next;
                  }
                  return out;
                });
                //add back-button function
                self.find('li').find('ul').prepend('<li class="back js-back"></li>');
                //view next level menu
                var tag_class = config.next.match(/class="(.*?)"/i)[1];
                var arrowLink = link.find('.'+tag_class);

                arrowLink.each(function (){
                   $(this).addClass('js-arrow');
                });

                $(link).on("click", ".js-arrow", function (e) {
                  e.preventDefault();
                  e.stopPropagation();
                  $(this).parents('ul').addClass('close-list');
                  $(this).closest('li').children('ul').addClass('active-menu');

                  var str = $(this).parents('a').text();
                  if (str.length > 0) {
                    str = str.substring(0, str.length - 1);
                  }
                  $(this).closest('li').find('li.back').text(str);
                  $('.js-back').append(config.prev);
                });

                //view prev level menu to click "back"
                $('.js-back').click(function () {
                  $(this).closest('ul.close-list').removeClass('close-list');
                  var that = this;
                  setTimeout(function () {
                    $(that).closest('ul').removeClass('active-menu');
                  }, 400);
                });

            }
        } else  {
           if (menuEnabled) {
              //return attr
              menuEnabled = false;
              self.attr('id', attrId);
              self.attr('class', attrClass);
              $('.js-arrow, .js-back, .js-swipe').detach();
            }

            $('body').removeClass('bodyFixed'); //remove fixedClass to body
            self.find('ul').removeClass();
          }
      }

      //remove attr mobile-device
      mobileMenu();

      //remove attr resize
      $(window).resize(function () {
        mobileMenu();
      });

      //animate menu function Call
      $('.js-toggle').add($('.js-overlay')).on("click", function () {
          openMenu();
      });

    };

    element.init();

    return element;

  };

})(jQuery, window, document);
