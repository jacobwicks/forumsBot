if (a.length && i.length) {
    var n = parseInt(b('body').attr('data-thread'), 10),
        k = function () {
            i.hasClass('unbookmark')
                ? a.html('Unbookmark this thread')
                : a.html('Bookmark this thread');
        },
        m = function () {
            i.hasClass('bookmark')
                ? i.attr({
                      src:
                          'https://fi.somethingawful.com/images/buttons/button-bookmark.png',
                      alt: 'Bookmark',
                      title: 'Bookmark thread',
                  })
                : i.attr({
                      src:
                          'https://fi.somethingawful.com/images/buttons/button-unbookmark.png',
                      alt: 'Unbookmark',
                      title: 'Unbookmark thread',
                  });
        },
        o = function () {
            if (e) {
                return !1;
            }
            e = !0;
            var f = {
                action: i.hasClass('unbookmark') ? 'remove' : 'add',
                threadid: n,
                json: 1,
            };
            b.post('/bookmarkthreads.php', f, function (g) {
                i.removeClass('bookmark unbookmark');
                g.bookmarked
                    ? i.addClass('unbookmark')
                    : i.addClass('bookmark');
                m();
                k();
                e = !1;
            });
        };
    i.click(o);
    a.click(o);
    m();
    k();
}

if (b('body').hasClass('usercp') || b('body').hasClass('bookmark_threads')) {
    (o = b('table#forum')),
        o.length &&
            (o.find('thead > tr').append('<th></th>'),
            o
                .find('tbody > tr')
                .append(
                    '<td class="button_remove"><div title="Remove bookmark"></div></td>'
                ),
            o.delegate('td.button_remove div', 'click', function () {
                var p = b(this),
                    f = p.parents('tr').eq(0),
                    g = d.exec(f.attr('id'));
                if (g) {
                    g = g[1];
                    if (p.data('pending')) {
                        return !1;
                    }
                    p.data('pending', !0);
                    p.removeClass('warn');
                    p.addClass('spin');
                    b.post(
                        '/bookmarkthreads.php',
                        { threadid: g, action: 'remove', json: 1 },
                        function () {
                            f.remove();
                        }
                    );
                }
                return !1;
            }));
}
// )}(window,document,jQuery);
