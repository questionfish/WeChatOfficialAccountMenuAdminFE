function test() {
    var a = new Button('菜单节点1-1', 'click', {'key': '1111'});
    var b = new Button('菜单节点1-2', 'view', {'url': 'http://www.baidu.com'});
    var c = new Button('菜单节点1-3', 'miniprogram', {'url': 'http://www.baidu.com', 'appid': 'asdasdasd', 'pagepath': 'pagepath'});
    var d = new Button('顶级菜单1', 'top', {'sub_button': [a, b]});
    var e = new Button('菜单节点2-1', 'click', {'key': '1111'});
    var f = new Button('菜单节点2-2', 'view', {'url': 'http://www.baidu.com'});
    var g = new Button('菜单节点2-3', 'miniprogram', {'url': 'http://www.baidu.com', 'appid': 'asdasdasd', 'pagepath': 'pagepath'});
    var h = new Button('顶级菜单2', 'top', {'sub_button': [a, b]});
    d.pushSubButton(c);
    // console.log(a.toJson());
    // console.log(b.toJson());
    // console.log(c.toJson());
    // console.log(d.toJson());

    var m = new Menu([d]);
    m.pushButton(h);
    console.log(m.toObj());

    console.log(m.len());
    console.log(m.len(1));
    m.moveTopButton(0, 1);
    console.log(m.toObj());
    m.moveSubButton(1, 0, 1);
    console.log(m.toObj());
}

test();