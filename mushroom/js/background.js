var INTERVAL = 3 * 60 * 1000;
var EVERY_NUM = 50;
var TIMER = setInterval(getNews, INTERVAL);

sessionStorage.unique = '';

//一小时清理一次
setInterval(function() {
    sessionStorage.unique = '';
}, INTERVAL * 12);

var cusEvent = {
    _data: {},
    fire: function(name, data) {
        var arr = this._data[name];
        if (arr.length) {
            var len = arr.length;
            for (var i = 0; i < len; i++) {
                var callback = arr[i];
                var once = callback._once;
                callback(data);
                if (once) {
                    arr.splice(i, 1);
                    i--;

                }
            }
        }
        return this;
    },
    once: function(name, callback) {
        return this.add(name, callback);
    },
    add: function(name, callback, once) {
        var arr = this._data[name] = this._data[name] || [];
        if (!~arr.indexOf(callback) && typeof callback === 'function') {
            callback._once = !!once;
            arr.push(callback);
        }
        return this;
    }
};




function getNews() {
    $.getJSON('http://guangdiu.com/api/getlist.php?count=10&_t=' + Date.now(), function(data) {
        dealList(data.data);
    });
    $.getJSON('http://guangdiu.com/api/getlist.php?count=10&country=us&_t=' + Date.now(), function(data) {
        dealList(data.data, 1);
    });
}

function dealList(data, isus) {
    if (!data) {
        return;
    }
    isus = isus || 0;
    var uni = sessionStorage.unique;

    var count = data.length;

    var _data = [];
    data.forEach(function(d) {
        // console.log(uni, d.id, uni.indexOf(d.id));
        if (uni.indexOf(d.id) === -1) {
            var id = d.id;
            sessionStorage.unique += '_' + id;
            var detail_url = 'http://guangdiu.com/api/showdetail.php?id=' + id;
            var go_url = 'http://guangdiu.com/go.php?catch=1&id=' + id;
            $.when(p_detail(detail_url), p_url(go_url)).done(function(detail, url) {
                d.detail = detail;
                d.url = go_url === url ? d.buyurl : url;
                end();
            });
            _data.push(d);
        } else {
            end();
        }
    });

    function end() {
        count--;
        if (count === 0 && _data.length) {
            // console.log(_data, isus);
            $.post('http://zhufu.sinaapp.com/spider/spider/update_items_chr.php?debug=1', {
                data: JSON.stringify(_data),
                isus: isus
            }, function(d) {
                console.log(d);
            });
        }
    }
}

function p_detail(url) {
    var d = $.Deferred();

    $.get(url, function(data) {
        var $node = $(data);
        var $abs = $node.find('#mdabstract');
        $abs.find('.m99adhead,.m99adfoot,.cheapitem,ul,h2,h3,h1,h4,h5,a img').remove();
        var t = $abs.find('dt').html();
        t = t ? t.trim() : '';
        t = t.replace(/<(span).*>(.+)<\/\1>/, '$2').replace(/&nbsp;/g, '');
        var text = [];
        $abs.find('p').each(function(i, v) {
            // $(v).find('a[isconvert]').removeAttr('isconvert');
            var $v = $(v);
            if ($v.text().trim() === '') {
                return;
            }
            var withLink = false;
            $v.find('a').each(function(n, a) {
                if ($(a).attr('href').indexOf('guangdiu.com') !== -1) {
                    $(a).remove();
                } else {
                    withLink = true;
                }
                $(a).removeAttr('onclick')

            });
            var others = $v.find('div,ul,img,li,dt,dl,table,a[isconvert!=1],a img');
            if (others.length) {
                return;
            }
            var p = $v.text().trim();
            if (withLink && p) {
                p = $v.html().trim();
                p.replace(/<a .*guangdiu.com>.*<\/a>/, '').replace(/<(span|strong).+?>(.+?)<\/\1>/g, '$2')

            }
            switch (p) {
                case '海淘攻略':
                case '':
                    break;
                default:
                    text.push(p);
            }
        });
        text = text.join('<br/>');
        if (!text && $abs[0]) {
            $abs.find('dt').remove();
            text = $abs[0].innerText.trim();
        }

        text = trimHtml(text + (t ? '<br/>' + t : ''), { limit: 500 }).html;

        if (text.length > 1000) {
            text = text.replace(/<[^>]+>/g, '');
        }
        text = text.replace(/(<br[\/]?>)+$/, '').replace(/^(<br[\/]?>)+/, '').replace(/<a [^>]+>\s+<\/a>/g, '').replace(/(\\t)+/g, '').replace(/<\!--.*-->/, '');
        d.resolve(text);
    });

    return d;
}
var isDone = {};

function p_url(url) {
    var d = $.Deferred();
    isDone[url] = 1;

    var urls = parse_url(url);
    if ($.inArray(urls.host, ['detail.tmall.com']) !== -1) {
        end(url);
    } else {
        cusEvent.once(url, function(rurl) {
            if (rurl && isDone[url]) {
                rurl = getUnionLink(rurl);
                end(rurl);
            }
        });
        $.get(url, function(data) {
            if (!isDone[url]) {
                //保证执行一次
                return;
            }
            var d = /(http[s]?:\/\/.*)['"]/g.exec(data);
            if (d && d[1]) {

                var u = getUnionLink(d[1]);
                if (u.length > 300 || /^http[s]?:\/\/www.w3.org/.test(u) || /['"]/.test(u)) {

                } else {
                    url = u;
                }
            }
            end(url);
        });
    }

    function end(url) {
        delete isDone[url];
        d.resolve(url);
    }

    return d;
}


chrome.webRequest.onBeforeRedirect.addListener(function(detail) {
    if (detail.statusCode === 301 && detail.redirectUrl) {
        cusEvent.fire(detail.url, detail.redirectUrl);
    }
    detail.redirectUrl = 'about:blank';

}, {
    urls: ["*://*.guangdiu.com/go.php?catch=1&id=*"]
}, ["responseHeaders"]);

function getUnionUrl(res) {
    if (res && res.length) {

        var count = 0;
        var items = [];

        var isDone = {};

        function end() {
            count--;

            if (count == 0) {
                postData(items);
                items.length = 0;
            }
        }
        res.forEach(function(r) {
            var id = r.id;
            var url = r.url;
            if (/^go.php/.test(url)) {
                url = '../' + url;
            }
            if (id && url && /^..\/go.php/.test(url)) {

                count++;

                url = 'http://guangdiu.com/go.php?catch=1&id=' + id;
                isDone[url] = 1;
                cusEvent.once(url, function(rurl) {
                    if (rurl && isDone[url]) {
                        delete isDone[url];
                        rurl = getUnionLink(rurl);
                        console.log(url, rurl);
                        items.push([id, rurl].join('$$$'));
                        end();
                    }
                });
                $.get(url, function(data) {
                    if (!isDone[url]) {
                        //保证执行一次
                        return;
                    }
                    /*
                    <script type='text/javascript'>var BgbdWfbx='https://c.duomai.com/track.php?t=https%3A%2F%2Fitem.jd.com%2F2848547.html&aid=61&site_id=94527&euid=n3362873';window.location.href=BgbdWfbx;</script>
                    <script type='text/javascript'>var KYlBdcWJ='https://c.duomai.com/track.php?t=http%3A%2F%2Fitem.jd.com%2F3865016.html&aid=61&site_id=94527&euid=n3451224';window.location.href=KYlBdcWJ;</script>
                     */
                    var d = /(http[s]?:\/\/.*)['"]/g.exec(data);
                    if (d && d[1]) {

                        var u = getUnionLink(d[1]);
                        if (u.length > 300 || /^http[s]?:\/\/www.w3.org/.test(u) || /['"]/.test(u)) {

                            end();
                            return;
                        }

                        items.push([id, u].join('$$$'));

                    } else {
                        console.log(url, data);
                    }
                    end();
                });
            }
        });

    }
}



function getUnionLink(url) {
    if (/^http[s]?:\/\/count.chanet.com.cn\/click.cgi/.test(url) || /www.jdoqocy.com\/click/.test(url)) {
        var u = url.match(/url=(.*)(\&|$)/);
        if (u && u[1]) {
            return decodeURIComponent(u[1]);
        } else {
            return url;
        }
    } else if (/^http[s]?:\/\/www.linkhaitao.com\/index.php/.test(url)) {
        var u = url.match(/new=(.*)(\&|$)/);
        if (u && u[1]) {
            return decodeURIComponent(u[1]);
        } else {

            return url;
        }
    }

    var urlObj = parse_url(url);
    var ymxUrl = getAmzUrl(url, urlObj);
    var host = urlObj.host;
    var query = urlObj.search;
    if (ymxUrl) {
        return ymxUrl;
    }
    return url;
}

function getAmzUrl(url, urlObj) {
    urlObj = urlObj || parse_url(url);
    if (/guangdiu-23/.test(url) || /ygk-23/.test(url) || /gdiu-\d{2}/.test(url)) {
        url = url.replace('guangdiu-23', 'wuhawuha-23');
        url = url.replace('ygk-23', 'wuhawuha-23');
        url = url.replace('gudiu-21', 'wuhawuha-23');
        url = url.replace('gdiu-20', 'wuhawuha-23');
        url = url.replace('as_li_ss_tl', 's9_wsim_gw_p351_d81_i2_gs9w');
        return url;
    } else if (/(tag|t)=(\w+)\-\d+/.test(url)) {
        url = url.replace(/(tag|t)=(\w+)\-\d+/, '\1=wuhawuha-23');

        return url;
    } else {
        var host = urlObj.host;
        if (/amazon/.test(host)) {
            if (url.indexOf('?') !== -1) {
                return url + '&tag=wuhawuha-23'
            } else {
                return url + '?tag=wuhawuha-23';
            }

        }
    }
    return false;
}

var parse_url = function() {
    var a = document.createElement('a');

    return function(url) {
        a.href = url;
        return {
            host: a.host,
            hostname: a.hostname,
            pathname: a.pathname,
            port: a.port,
            protocol: a.protocol + '//',
            search: a.search,
            hash: a.hash
        };
    }
}();
//start
//
function trimHtml(html, options) {

    options = options || {};

    var limit = options.limit || 100,
        wordBreak = (typeof options.wordBreak !== 'undefined') ? options.wordBreak : false,
        suffix = options.suffix || '';

    var arr = html.replace(/</g, "\n<")
        .replace(/>/g, ">\n")
        .replace(/\n\n/g, "\n")
        .replace(/^\n/g, "")
        .replace(/\n$/g, "")
        .split("\n");

    var sum = 0,
        row, cut, add,
        tagMatch,
        tagName,
        tagStack = [],
        more = [];

    for (var i = 0; i < arr.length; i++) {

        row = arr[i];
        // count multiple spaces as one character
        rowCut = row.replace(/[ ]+/g, ' ');

        if (!row.length) {
            continue;
        }

        if (row[0] !== "<") {

            if (sum >= limit) {
                row = "";
                more.push(arr[i]);
            } else if ((sum + rowCut.length) >= limit) {

                cut = limit - sum;

                if (row[cut - 1] === ' ') {
                    while (cut) {
                        cut -= 1;
                        if (row[cut - 1] !== ' ') {
                            break;
                        }
                    }
                } else {

                    add = row.substring(cut).split('').indexOf(' ');

                    // break on halh of word
                    if (!wordBreak) {
                        if (add !== -1) {
                            cut += add;
                        } else {
                            cut = row.length;
                        }
                    }
                }

                row = row.substring(0, cut) + suffix;
                sum = limit;
                more.push(row.slice(cut + suffix.length));

            } else {
                sum += rowCut.length;
            }

        } else if (sum >= limit) {
            tagMatch = row.match(/[a-zA-Z]+/);

            tagName = tagMatch ? tagMatch[0] : '';

            if (tagName) {
                if (row.substring(0, 2) !== '</') {

                    tagStack.push(tagName);
                    row = '';
                    more.push(arr[i]);
                } else {

                    while (tagStack[tagStack.length - 1] !== tagName && tagStack.length) {
                        tagStack.pop();
                    }

                    if (tagStack.length) {
                        row = '';
                        more.push(arr[i]);

                    }

                    tagStack.pop();
                }
            } else {
                row = '';
                more.push(arr[i]);

            }
        }

        arr[i] = row;
    }

    return {
        html: arr.join("\n").replace(/\n/g, ""),
        more: more.join("\n").replace(/\n/g, "")
    };
}
