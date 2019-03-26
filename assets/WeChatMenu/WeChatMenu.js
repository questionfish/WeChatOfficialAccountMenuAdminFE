/**!
 * WeChat Official Account Menu
 * @author	mayunyun1   <mayunyun1@100tal.com>
 * @license MIT
 */

(function weChatMenuModule(factory) {
    "use strict";
    if (typeof define === "function" && define.amd) {
        define(factory);
    }
    else if (typeof module != "undefined" && typeof module.exports != "undefined") {
        module.exports = factory();
    }
    else {
        /* jshint sub:true */
        var product = factory();
        window["Menu"] = product[0];
        window["Button"] = product[1];
        window["MenuView"] = product[2];
    }
})(function weChatMenuFactory() {
    "use strict";

    /**
     * 获取所有自定义属性key
     *
     * @returns {Array}
     */
    Object.prototype.values = function () {
        var res = [];
        for (var key in this) {
            if (this.hasOwnProperty(key)) {
                res.push(this[key]);
            }
        }
        return res;
    };

    /**
     * 获取所有自定义属性value
     *
     * @returns {Array}
     */
    Object.prototype.keys = function () {
        var res = [];
        for (var key in this) {
            if (this.hasOwnProperty(key)) {
                res.push(key);
            }
        }
        return res;
    };

    /**
     * 判断object是否为Array
     *
     * @returns {boolean}
     */
    Object.prototype.isArr = function () {
        return typeof this === 'object' && this.constructor.name === 'Array';
    };

    /**
     * 菜单按钮类
     * @property name
     * @property type
     * @property key
     * @property url
     * @property appid
     * @property pagepath
     * @property sub_button
     *
     * @param name
     * @param type
     * @param props
     * @constructor
     */
    function Button(name, type, props) {
        this.isButton = true;
        this.typeEnum = {top: 'top', click: 'click', view: 'view', miniprogram: 'miniprogram'};
        this.propEnum = {key: 'key', url: 'url', appid: 'appid', pagepath: 'pagepath', sub_button: 'sub_button'};

        if (typeof name !== 'string') {
            throw new Error('Menu name must be string.')
        }

        this._checkType(type);

        this.name = name;
        this.type = type;
        this.setProps(type, props)
    }

    /**
     * 检查type合法性
     *
     * @param type
     * @returns {boolean}
     * @private
     */
    Button.prototype._checkType = function (type) {
        if (typeof type !== 'string' || !this.typeEnum[type]) {
            throw new Error('Type name must be on of ["' + this.typeEnum.values().join('", "') + '"]');
        }
        return true;
    };

    /**
     * 清除所有属性
     *
     * @param type
     * @private
     */
    Button.prototype._clearProps = function (type) {
        for (var i in this.propEnum) {
            var propName = this.propEnum[i];
            delete this[propName];
        }
    };

    /**
     * 检查type对应属性
     *
     * @param type
     * @param props
     * @returns {boolean}
     * @private
     */
    Button.prototype._checkTypeProps = function (type, props) {
        switch (type) {
            case this.typeEnum.top:
                var err = new Error('Sub button must be array.');
                if (typeof props.sub_button !== 'object' || !props.sub_button.isArr()) {
                    throw err;
                }
                for (var i = 0; i < props.sub_button.length; ++i) {
                    if (!props.sub_button[i].isButton) {
                        throw err;
                    }
                }
                break;
            case this.typeEnum.click:
                if (typeof props.key !== 'string') {
                    throw new Error('Button key must be string.')
                }
                break;
            case this.typeEnum.view:
                if (typeof props.url !== 'string') {
                    throw new Error('Button url must be string.')
                }
                break;
            case this.typeEnum.miniprogram:
                if (typeof props.url !== 'string') {
                    throw new Error('Button url must be string.')
                }
                if (typeof props.appid !== 'string') {
                    throw new Error('Button appid must be string.')
                }
                if (typeof props.pagepath !== 'string') {
                    throw new Error('Button pagepath must be string.')
                }
                break;
        }
        return true;
    };

    /**
     * 设置按钮类型相关属性
     *
     * @param type
     * @param props
     */
    Button.prototype.setProps = function (type, props) {
        this._checkType(type);
        this._clearProps();
        this._checkTypeProps(type, props);

        switch (this.type) {
            case this.typeEnum.top:
                this.type = type;
                this.sub_button = props.sub_button;
                break;
            case this.typeEnum.click:
                this.type = type;
                this.key = props.key;
                break;
            case this.typeEnum.view:
                this.type = type;
                this.url = props.url;
                break;
            case this.typeEnum.miniprogram:
                this.type = type;
                this.url = props.url;
                this.appid = props.appid;
                this.pagepath = props.pagepath;
                break;
        }
    };

    /**
     * 获取按钮类型相关属性
     *
     * @returns {*}
     */
    Button.prototype.getProps = function () {
        switch (this.type) {
            case this.typeEnum.top:
                var res = {};
                res.sub_button = [];
                for (var i = 0; i < this.sub_button.length; ++i) {
                    res.sub_button.push(this.sub_button[i].toObj());
                }
                return res;
            case this.typeEnum.click:
                return {
                    type: this.type
                    , key: this.key
                    , sub_button: []
                };
            case this.typeEnum.view:
                return {
                    type: this.type
                    , url: this.url
                    , sub_button: []
                };
            case this.typeEnum.miniprogram:
                return {
                    type: this.type
                    , url: this.url
                    , appid: this.appid
                    , pagepath: this.pagepath
                    , sub_button: []
                };
        }
    };

    /**
     * 增加子按钮
     *
     * @param subButton
     */
    Button.prototype.pushSubButton = function (subButton) {
        if (this.type !== 'top') {
            throw new Error('Only top node can add sub button.');
        }
        this.sub_button[this.sub_button.length] = subButton;
    };

    /**
     * 获取按钮所有属性
     *
     * @returns {{name: *, type: *, ...}}
     */
    Button.prototype.toObj = function () {
        var resObj = {
            name: this.name,
        };
        Object.assign(resObj, this.getProps());
        return resObj;
    };

    /**
     * 是否顶级菜单
     *
     * @returns {boolean}
     */
    Button.prototype.isTop = function() {
        return this.type === this.typeEnum.top;
    };

    /**
     * 是否叶子节点
     *
     * @returns {boolean}
     */
    Button.prototype.isLeaf = function() {
        return !this.sub_button || this.sub_button.length === 0;
    };

    /**
     * 获取按钮对应json
     *
     * @returns {string}
     */
    Button.prototype.toJson = function () {
        return JSON.stringify(this.toObj());
    };

    /**
     * 移动子button
     *
     * @param oldIdx
     * @param newIdx
     */
    Button.prototype.moveChild = function (oldIdx, newIdx) {
        if(this.isLeaf() || oldIdx >= this.sub_button.length || newIdx >= this.sub_button.length){
            throw new Error('Sub button idx out of range.');
        }
        var button = this.sub_button.splice(oldIdx, 1)[0];
        this.sub_button.splice(newIdx, 0, button);
    };

    /**
     * 菜单类
     * @property button
     *
     * @param button
     * @constructor
     */
    function Menu(button) {
        this.isMenu = true;
        if(button.isArr()) {
            if(this && this._checkButtons(button)){
                this.button = button;
            } else {
                this._fillWithObject(button);
            }
        } else if(typeof button === 'string'){
            var menuObj = JSON.parse(button);
            var buttonObj;
            if(menuObj.button) {
                buttonObj = menuObj.button;
            } else {
                buttonObj = menuObj;
            }
            this._fillWithObject(buttonObj);
        }
    }

    /**
     * 检查传入参数
     *
     * @param button
     * @private
     */
    Menu.prototype._checkButtons = function (button) {
        for (var i = 0; i < button.length; ++i) {
            if (!button[i].isButton) {
                return false
            }
        }
        return true;
    };

    Menu.prototype._fillWithObject = function (button) {
        this.button = [];
        for (var i = 0; i < button.length; ++i) {
            if(!button[i].type && button[i].sub_button && button[i].sub_button.isArr()) {
                button[i].type = 'top';
                var topBtnSubBtn = [];
                for (var j = 0; j < button[i].sub_button.length; ++j){
                    var subBtnInfo = button[i].sub_button[j];
                    var subBtn = new Button(subBtnInfo.name, subBtnInfo.type, subBtnInfo);
                    topBtnSubBtn.push(subBtn);
                }
                this.button.push(new Button(button[i].name, button[i].type, {sub_button: topBtnSubBtn}));
            } else {
                this.button.push(new Button(button[i].name, button[i].type, button[i]));
            }
        }
    };

    /**
     * 增加子按钮
     *
     * @param button
     */
    Menu.prototype.pushButton = function (button) {
        if (!button.isButton) {
            throw new Error('Button list must be an array of Button');
        }
        this.button.push(button);
    };

    /**
     * 转为obj
     *
     * @returns {{button: Array}}
     */
    Menu.prototype.toObj = function () {
        var res = {button: []};
        for (var i = 0; i < this.button.length; ++i) {
            res.button.push(this.button[i].toObj())
        }
        return res;
    };

    /**
     * 转为json
     *
     * @returns {string}
     */
    Menu.prototype.toJson = function () {
        return JSON.stringify(this.toObj());
    };

    /**
     * 获取（子）菜单长度
     *
     * @param topIdx
     * @returns {*}
     */
    Menu.prototype.len = function(topIdx) {
        if(!topIdx){
            return this.button.length;
        }
        if(topIdx >= this.button.length) {
            throw new Error('TopIdx out of range.');
        }
        if(this.button[topIdx].isLeaf()) {
            throw new Error('Button topIdx has no sub button.');
        }
        return this.button[topIdx].sub_button.length;
    };

    /**
     * 移动顶级菜单
     *
     * @param oldTopIdx
     * @param newTopIdx
     */
    Menu.prototype.moveTopButton = function(oldTopIdx, newTopIdx) {
        if(Math.max(oldTopIdx, newTopIdx) >= this.len()) {
            throw new Error('Top button idx out of range.');
        }
        var button = this.button.splice(oldTopIdx, 1)[0];
        this.button.splice(newTopIdx, 0, button);
    };

    /**
     * 移动子菜单
     *
     * @param topIdx
     * @param oldSubIdx
     * @param newTopIdx
     */
    Menu.prototype.moveSubButton = function(topIdx, oldSubIdx, newTopIdx) {
        if(topIdx >= this.button.length){
            throw new Error('Button topIdx is not top button');
        }

        this.button[topIdx].moveChild(oldSubIdx, newTopIdx);
    };

    var addSubBtnElCls = 'custom-menu-view__menu__sub__add text-ellipsis';
    var addTopBtnElCls = 'custom-menu-view__menu glyphicon glyphicon-plus text-info iBtn';
    var subBtnElCls = 'custom-menu-view__menu__sub__add';
    var topBtnElCls = 'custom-menu-view__menu';
    var topBtnNameElCls = 'text-ellipsis';
    var subBtnUlCls = 'custom-menu-view__menu__sub';
    var topBtnUlCls = 'custom-menu-view__footer__right';
    var topBtnUlId = 'menu-view';

    var addSubBtnElTag = 'li';
    var addTopBtnElTag = 'div';
    var subBtnElTag = 'li';
    var subBtnUlTag = 'ul';
    var topBtnElTag = 'div';
    var topBtnNameElTag = 'div';

    var idxAttrName = 'wechat-menu-idx';
    var idxDelimiter = '-';
    var addBtnAttrName = 'wechat-menu-add-btn';

    Object.prototype.setMenuIdx = function (idx1, idx2) {
        var idx = idx1 + (idx2 !== undefined ? idxDelimiter + idx2 : '');
        this.setAttribute(idxAttrName, idx);
    };

    Object.prototype.getMenuIdx = function () {
        var idx = this.getAttribute(idxAttrName);
        return idx.split(idxDelimiter);
    };

    Object.prototype.isAddBtn = function (is) {
        if(is !== undefined){
            if(is === true){
                this.toggleAttribute(addBtnAttrName, true);
            } else {
                this.toggleAttribute(addBtnAttrName, false);
            }
        }
        return this.hasAttribute(addBtnAttrName);
    };

    function MenuView(menu) {
        if(!menu.isMenu){
            throw new Error('Menu must be a object of Menu');
        }
        this.menu = menu;

        this.topBtnUl = document.getElementById(topBtnUlId);
        this.topBtnUl.className = topBtnUlCls;

        for (var i = 0; i < menu.button.length; ++i ) {
            var topBtn = this.createTopBtn(menu.button[i].name);
            var subBtnUl = this.createSubBtnUl();
            topBtn.appendChild(subBtnUl);
            for (var j = 0; menu.button[i].sub_button && j < menu.button[i].sub_button.length; ++j){
                subBtnUl.appendChild(this.createSubBtn(menu.button[i].sub_button[j].name));
            }
            if(!menu.button[i].sub_button || menu.button[i].sub_button.length < 5) {
                subBtnUl.appendChild(this.createAddSubBtn());
            }
            this.topBtnUl.appendChild(topBtn);
        }
        if(menu.button.length < 3) {
            this.topBtnUl.appendChild(this.createAddTopBtn());
        }
        this.reIndex();
    }

    MenuView.prototype.createTopBtn = function(name) {
        var topBtn = document.createElement(topBtnElTag);
        topBtn.className = topBtnElCls;
        var topBtnNameEl = document.createElement(topBtnNameElTag);
        topBtnNameEl.className = topBtnNameElCls;
        topBtnNameEl.innerHTML = name;
        topBtn.appendChild(topBtnNameEl);
        return topBtn;
    };

    MenuView.prototype.createSubBtnUl = function() {
        var subBtnUl = document.createElement(subBtnUlTag);
        subBtnUl.className = subBtnUlCls;
        return subBtnUl;
    };

    MenuView.prototype.createSubBtn = function(name) {
        var subBtnEl = document.createElement(subBtnElTag);
        subBtnEl.className = subBtnElCls;
        subBtnEl.innerHTML = name;
        return subBtnEl;
    };

    MenuView.prototype.createAddSubBtn = function() {
        var addSubBtnEl = document.createElement(addSubBtnElTag);
        addSubBtnEl.className = addSubBtnElCls;
        addSubBtnEl.isAddBtn(true);
        return addSubBtnEl;
    };

    MenuView.prototype.createAddTopBtn = function() {
        var addTopBtnEl = document.createElement(addTopBtnElTag);
        addTopBtnEl.className = addTopBtnElCls;
        addTopBtnEl.isAddBtn(true);
        this.topBtnUl.appendChild(addTopBtnEl);
        return addTopBtnEl;
    };

    MenuView.prototype._getSubBtnUl = function(topBtnIdx) {
        return this.topBtnUl.children[topBtnIdx].children[1];
    };

    MenuView.prototype.reIndex = function(topBtnUl){
        for (var i = 0; i < this.topBtnUl.children.length; ++i){
            var topBtnEl = this.topBtnUl.children[i];
            if(topBtnEl.isAddBtn()) continue;
            topBtnEl.setMenuIdx(i);
            var subBtnUl = this._getSubBtnUl(i);
            for (var j = 0; subBtnUl && j < subBtnUl.children.length; ++j){
                if(subBtnUl.children[j].isAddBtn()) continue;
                subBtnUl.children[j].setMenuIdx(i, j);
            }
        }
    };

    MenuView.prototype.sortable = function(newStatus){
        if(newStatus) {
            this._displayAddBtnEl(false);
            var that = this;
            this.sortableUlArr = [];
            this.sortableUlArr.push(new Sortable(this.topBtnUl, {
                animation: 300,
                disabled: false,
                onEnd: function (evt) {
                    that.menu.moveTopButton(evt.oldIndex, evt.newIndex);
                    that.reIndex();
                }
            }));
            for (var i = 0; i < this.topBtnUl.children.length; ++i){
                var subBtnUl = this._getSubBtnUl(i);
                if(subBtnUl && subBtnUl.children.length > 0) {
                    this.sortableUlArr.push(new Sortable(subBtnUl, {
                        animation: 300,
                        disabled: false,
                        onEnd: function (evt) {
                            that.menu.moveSubButton(evt.item.getMenuIdx()[0], evt.oldIndex, evt.newIndex);
                            that.reIndex();
                        }
                    }));
                }
            }
        } else {
            var el = $('.custom-menu-view__footer__right')[0];
            var sortableUl;
            while (this.sortableUlArr && (sortableUl = this.sortableUlArr.pop())) {
                sortableUl.destroy();
            }
            this._displayAddBtnEl(true);
        }
    };

    MenuView.prototype._displayAddBtnEl = function (display) {
        if(this.topBtnUl.lastChild.isAddBtn()){
            this.topBtnUl.lastChild.style.display = display ? null: 'none';
        }
        for (var i = 0; this.topBtnUl.children && i < this.topBtnUl.children.length; ++i){
            var subBtnUl = this._getSubBtnUl(i);
            if(subBtnUl && subBtnUl.lastChild.isAddBtn()){
                subBtnUl.lastChild.style.display = display ? null: 'none';
            }
        }
    };

    // Export
    Menu.version = '1.0.1';
    return [Menu, Button, MenuView];
});