; (function ($, window, document) {

  //defaults value
  var defaults = {
    'width' : 1024,
    'next' : '<span class="arrow"></span>',
    'prev' : '<span class="back-arrow">&lsaquo;</span>',
    'linkSwitch' : false,
    'openButonTheme' : 'menu',
    'nextButonTheme' : 'angle-right',
    'prevButonTheme' : 'angle-left',
    'colorTheme' : ''
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
          elementAttrId = element.attr('id'),
          elementAttrClass = element.attr('class'),
          arrClassList = [],
          attrIdList = [],
          arrClassItem = [],
          arrClassLink = [],
          childrenList = element.find('ul'),
          childrenItem = element.find('li'),
          childrenLink = element.find('a'),
          menuEnabled = false,
          prx = 'icon-',
          openButtonClass = prx + self.options.openButonTheme,
          nextButtonClass = prx + self.options.nextButonTheme,
          prevButtonClass = prx + self.options.prevButonTheme;
          
        //addColor function
        function addColor(element) {
          if(self.options.colorTheme != '') {
            $(element).css({'color' : self.options.colorTheme})
          }
        }

        //Parse Attr menuElements
        function addAttrInArr(el, attribute, arr) {
          el.each(function(indx) {
            if($(this).attr(attribute) != undefined) {
              arr.push($(this).attr(attribute));
            } else {
              arr.push('');
            }
          });
        }

        //OutParse Attr menuElements
        function outAttrArr(el, attr, arr) {
          el.each(function(indx) {
            var attrValue = arr[indx];
            $(this).attr(attr, attrValue)
          });
        }

        //create animate-menu function
        function openMenu() {
          $('body').toggleClass('bodyFixed');
          setTimeout(function() {
            $('.multilevelMenu ul').attr('class', '');
          }, 200);
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
                element.find('ul').attr('style', '');
              }
            });

            //close menu left-swipe
            $('.multilevelMenu').on('touchend', function (e) {
              touchendX = e.originalEvent.changedTouches[0].pageX;
              if (touchendX < (touchstartX - 30)) {
                $('body').removeClass('bodyFixed');
                setTimeout(function () {
                  $('.multilevelMenu ul').attr('class', '');
                }, 200);
              }
            });
          } else {
            return false;
          }
        }

        addAttrInArr(childrenList, 'class', arrClassList);
        addAttrInArr(childrenList, 'id', attrIdList);
        addAttrInArr(childrenItem, 'class', arrClassItem);
        addAttrInArr(childrenLink, 'class', arrClassLink);

        //addopenButtonTheme
        $('.multimenuToggle').addClass(openButtonClass);
        addColor('.multimenuToggle');

        //add Overlay
        element.before('<div class="multilevelOverlay js-overlay"></div>');

        //create work-menu function
        function mobileMenu() {
          var w = window.innerWidth ? window.innerWidth : $(window).width();

          //next level function
          function nextLevelFunction (e, el) {
            e.preventDefault();
            e.stopPropagation();
            var elem = el.closest('li').children('ul'),
                elemHeight = elem.innerHeight() + 15;
            el.parents('ul').addClass('close-list').height(elemHeight);
            elem.addClass('active-menu').height(elemHeight);
          }

          //add text for prev button function
          function textPrevButton (str, el) {
            el.closest('li').find('li.back').text(str).prepend(self.options.prev);
            return el.closest('li').find('li.back').find('> *').addClass('js-prev ' + prevButtonClass);
          }

          if (w < self.options.width) {
            //remove attr
             if (!menuEnabled) {
                  menuEnabled = true;
                  element.removeAttr('id');
                  element.removeClass();
                  element.addClass('multilevelMenu');
                  childrenList.removeClass();
                  childrenList.removeAttr('id');
                  childrenItem.removeClass();
                  childrenLink.removeClass();

                  //call swipe function
                  SwipeOpenMenu();
                  //add switch-button for children ul
                  var link = element.find('a');
                  link.append(function(indx, val) {
                    var out = '';
                    if($(this).parent('li').find('ul').length > 0) {
                      out = self.options.next;
                    }
                    addColor('.js-arrow ');
                    return $(out).addClass('js-arrow ' + nextButtonClass);
                  });
                  //add back-button function
                  element.find('li').find('ul').prepend('<li class="back js-back">Назад</li>');

                  //view next level menu full button
                  if (self.options.linkSwitch == true) {
                    $(link).on("click", function (e) {
                      if ($(this).next('ul').length > 0) {
                        nextLevelFunction (e, $(this));
                      }
                      //name prev-button text
                      var str = $(this).text();
                      textPrevButton (str, $(this));
                      addColor('.js-prev');
                    });

                  } else {
                    //view next level menu on only arrow
                    $(link).on("click", ".js-arrow", function (e) {
                      nextLevelFunction (e, $(this));
                      //name prev-button text
                      var str = $(this).parents('a').text();
                      textPrevButton (str, $(this));
                      addColor('.js-prev');
                    });
                  }

                  //view prev level menu to click "back"
                  $('.js-back').click(function () {
                    var parent = $(this).closest('ul.close-list'),
                        parentHeight = 0;
                    parent.children('li').each(function(idx) {
                        parentHeight += $(this).innerHeight();
                    });
                    parent.removeClass('close-list');
                    $(this).parents('ul').innerHeight(parentHeight);
                    $(this).closest('ul').addClass('hidden-menu').attr('style', '');
                    var that = this;
                    setTimeout(function () {
                      $(that).closest('ul').removeClass('active-menu hidden-menu');
                    }, 200);
                  });

              }
          } else  {
             if (menuEnabled) {
                //return attr
                menuEnabled = false;
                element.attr('id', elementAttrId);
                element.attr('class', elementAttrClass);
                element.find('ul').attr('style', '');
                outAttrArr(childrenList, 'class', arrClassList);  
                outAttrArr(childrenList, 'id', attrIdList);   
                outAttrArr(childrenItem, 'class', arrClassItem);
                outAttrArr(childrenLink, 'class', arrClassLink);           
                $('.js-arrow, .js-back, .js-swipe').detach();
              }

              $('body').removeClass('bodyFixed'); //remove fixedClass to body
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
        $('.multimenuToggle').add($('.js-overlay')).on("click", function () {
            //call animate-menu function
            openMenu();
            element.find('ul').attr('style', '');
        });

  };


  $.fn.mobileMenu = function (options) {
    new MultiMenu(this.first(), options);
    return this.first();
  };

})(jQuery, window, document);