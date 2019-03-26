function test() {

    // var a = new Button('菜单节点1-1', 'click', {'key': '1111'});
    // var b = new Button('菜单节点1-2', 'view', {'url': 'http://www.baidu.com'});
    // var c = new Button('菜单节点1-3', 'miniprogram', {'url': 'http://www.baidu.com', 'appid': 'asdasdasd', 'pagepath': 'pagepath'});
    // var d = new Button('顶级菜单1', 'top', {'sub_button': [a, b]});
    // var e = new Button('菜单节点2-1', 'click', {'key': '1111'});
    // var f = new Button('菜单节点2-2', 'view', {'url': 'http://www.baidu.com'});
    // var g = new Button('菜单节点2-3', 'miniprogram', {'url': 'http://www.baidu.com', 'appid': 'asdasdasd', 'pagepath': 'pagepath'});
    // var h = new Button('顶级菜单2', 'top', {'sub_button': [a, b]});
    // d.pushSubButton(c);
    // // console.log(a.toJson());
    // // console.log(b.toJson());
    // // console.log(c.toJson());
    // // console.log(d.toJson());
    //
    // var m = new Menu([d]);
    // m.pushButton(h);
    // // console.log(m.toObj());
    // // console.log(m.len());
    // // console.log(m.len(1));
    // m.moveTopButton(0, 1);
    // // console.log(m.toObj());
    // m.moveSubButton(1, 0, 1);
    // console.log(m.toObj());
    //
    // m = new Menu([
    //         {
    //             "type": "click",
    //             "name": "今日歌曲",
    //             "key": "col_2",
    //             "sub_button": [ ]
    //         },
    //         {
    //             "name": "菜单",
    //             "sub_button": [
    //                 {
    //                     "type": "view",
    //                     "name": "搜索",
    //                     "url": "http://www.soso.com/"
    //                 },
    //                 {
    //                     "type": "view",
    //                     "name": "视频",
    //                     "url": "http://v.qq.com/"
    //                 },
    //                 {
    //                     "type": "click",
    //                     "name": "赞一下我们",
    //                     "key": "col_1"
    //                 },
    //                 {
    //                     "type": "click",
    //                     "name": "赞一下我们",
    //                     "key": "col_1"
    //                 },
    //                 {
    //                     "type": "click",
    //                     "name": "赞一下我们",
    //                     "key": "col_1"
    //                 }
    //             ]
    //         }
    //     ]
    // );
    // console.log(m.toJson());

    m3 = new Menu('{"button":[{"name":"今日歌曲","type":"click","key":"col_2","sub_button":[]},{"name":"菜单","sub_button":[{"name":"搜索","type":"view","url":"http://www.soso.com/","sub_button":[]},{"name":"视频","type":"view","url":"http://v.qq.com/","sub_button":[]},{"name":"赞一下我们","type":"click","key":"col_1","sub_button":[]},{"name":"赞一下我们","type":"click","key":"col_1","sub_button":[]},{"name":"赞一下我们","type":"click","key":"col_1","sub_button":[]}]}]}');
    console.log(m3.toJson());
}

test();