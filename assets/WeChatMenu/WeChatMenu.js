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


    var
        /** @const */
        R_SPACE = /\s+/g,
        expando = 'MenuView' + (new Date).getTime(),

        IDX_ATTR = 'wechat-menu-idx',
        IDX_DELIMIT = '-',
        CREATE_BTN_TAG = 'wechat-menu-btn-add',
        BTN_TAG = 'wechat-menu-btn',
        TOP_BTN_TAG = 'wechat-menu-btn-top',

        /** @config */
        subBtnUlCls = 'custom-menu-view__menu__sub',
        topBtnUlCls = 'custom-menu-view__footer__right',
        subBtnElCls = 'custom-menu-view__menu__sub__add',
        topBtnElCls = 'custom-menu-view__menu',
        topBtnNameElCls = 'text-ellipsis',
        createSubBtnElCls = 'custom-menu-view__menu__sub__add text-ellipsis',
        createTopBtnElCls = 'custom-menu-view__menu',
        createTopBtnNameElCls = 'glyphicon glyphicon-plus text-info iBtn',
        selectedBtnElCls = 'subbutton__actived',

        subBtnElTag = 'li',
        subBtnUlTag = 'ul',
        topBtnElTag = 'div',
        topBtnNameElTag = 'div',
        addSubBtnElTag = 'li',
        addTopBtnElTag = 'div',

        containerId = 'menu-view',

        clickBtn = function (btnIdx, btnInfo) {
            console.log(btnIdx, btnInfo);
        },

        /** @function */
        _toggleClass = function (el, name, state) {
            if (el && name) {
                if (el.classList) {
                    el.classList[state ? 'add' : 'remove'](name);
                } else {
                    var className = (' ' + el.className + ' ').replace(R_SPACE, ' ').replace(' ' + name + ' ', ' ');
                    el.className = (className + (state ? ' ' + name : '')).replace(R_SPACE, ' ');
                }
            }
        },

        _values = function (obj) {
            var res = [];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    res.push(obj[key]);
                }
            }
            return res;
        },

        _isArr = function (obj) {
            return typeof obj === 'object' && obj.constructor.name === 'Array';
        },

        _err = function (msg) {
            throw new Error(msg);
        },

        _extend = function(dst, src) {
            if (dst && src) {
                for (var key in src) {
                    if (src.hasOwnProperty(key)) {
                        dst[key] = src[key];
                    }
                }
            }
            return dst;
        },

        /** @btnTypes */
        _isCreateBtn = function (el, state) {
            if (state) {
                if (state === true) {
                    el.toggleAttribute(CREATE_BTN_TAG, true);
                } else {
                    el.toggleAttribute(CREATE_BTN_TAG, false);
                }
            }
            return el.hasAttribute(CREATE_BTN_TAG);
        },
        _isBtn = function (el, state) {
            if (state) {
                if (state === true) {
                    el.toggleAttribute(BTN_TAG, true);
                } else {
                    el.toggleAttribute(BTN_TAG, false);
                }
            }
            return el.hasAttribute(BTN_TAG);
        },
        _isTopBtn = function (el, state) {
            if (state) {
                if (state === true) {
                    el.toggleAttribute(TOP_BTN_TAG, true);
                } else {
                    el.toggleAttribute(TOP_BTN_TAG, false);
                }
            }
            return el.hasAttribute(TOP_BTN_TAG);
        },

        /** @btnMenuIdx */
        _setMenuIdx = function (el, idxTop, idxSub) {
            el.setAttribute(IDX_ATTR, idxTop + (idxSub !== undefined ? IDX_DELIMIT + idxSub : ''));
        },
        _getMenuIdx = function (el) {
            return el.hasAttribute(IDX_ATTR) ? el.getAttribute(IDX_ATTR).split(IDX_DELIMIT) : [];
        };

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

    Button.prototype = {
        _checkType: function (type) {
            if (typeof type !== 'string' || !this.typeEnum[type]) {
                _err('Type name must be on of ["' + _values(this.typeEnum).join('", "') + '"]');
            }
            return true;
        },

        _clearProps: function (type) {
            for (var i in this.propEnum) {
                var propName = this.propEnum[i];
                delete this[propName];
            }
        },

        _checkTypeProps: function (type, props) {
            switch (type) {
                case this.typeEnum.top:
                    var err = new Error('Sub button must be array.');
                    if (typeof props.sub_button !== 'object' || !_isArr(props.sub_button)) {
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
                        _err('Button key must be string.')
                    }
                    break;
                case this.typeEnum.view:
                    if (typeof props.url !== 'string') {
                        _err('Button url must be string.')
                    }
                    break;
                case this.typeEnum.miniprogram:
                    if (typeof props.url !== 'string') {
                        _err('Button url must be string.')
                    }
                    if (typeof props.appid !== 'string') {
                        _err('Button appid must be string.')
                    }
                    if (typeof props.pagepath !== 'string') {
                        _err('Button pagepath must be string.')
                    }
                    break;
            }
            return true;
        },
        setProps: function (type, props) {
            this._checkType(type);
            this._clearProps();
            this._checkTypeProps(type, props);

            this.type = type;
            switch (this.type) {
                case this.typeEnum.top:
                    this.sub_button = props.sub_button;
                    break;
                case this.typeEnum.click:
                    this.key = props.key;
                    break;
                case this.typeEnum.view:
                    this.url = props.url;
                    break;
                case this.typeEnum.miniprogram:
                    this.url = props.url;
                    this.appid = props.appid;
                    this.pagepath = props.pagepath;
                    break;
            }
        },
        getProps: function () {
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
        },
        pushSubButton: function (subButton) {
            if (this.type !== 'top') {
                _err('Only top node can add sub button.');
            }
            this.sub_button[this.sub_button.length] = subButton;
        },
        toObj: function () {
            var resObj = {
                name: this.name,
            };
            Object.assign(resObj, this.getProps());
            return resObj;
        },
        isTop: function () {
            return this.type === this.typeEnum.top;
        },
        isLeaf: function () {
            return !this.sub_button || this.sub_button.length === 0;
        },
        toJson: function () {
            return JSON.stringify(this.toObj());
        },
        moveChild: function (oldIdx, newIdx) {
            if (this.isLeaf() || oldIdx >= this.sub_button.length || newIdx >= this.sub_button.length) {
                _err('Sub button idx out of range.');
            }
            var button = this.sub_button.splice(oldIdx, 1)[0];
            this.sub_button.splice(newIdx, 0, button);
        }
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
        if (_isArr(button)) {
            if (this && this._checkButtons(button)) {
                this.button = button;
            } else {
                this._fillWithObject(button);
            }
        } else if (typeof button === 'string') {
            var menuObj = JSON.parse(button);
            var buttonObj;
            if (menuObj.button) {
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
    Menu.prototype = {
        _checkButtons : function (button) {
            for (var i = 0; i < button.length; ++i) {
                if (!button[i].isButton) {
                    return false
                }
            }
            return true;
        },
        _fillWithObject: function (button) {
            this.button = [];
            for (var i = 0; i < button.length; ++i) {
                if (!button[i].type && button[i].sub_button && _isArr(button[i].sub_button)) {
                    button[i].type = 'top';
                    var topBtnSubBtn = [];
                    for (var j = 0; j < button[i].sub_button.length; ++j) {
                        var subBtnInfo = button[i].sub_button[j];
                        var subBtn = new Button(subBtnInfo.name, subBtnInfo.type, subBtnInfo);
                        topBtnSubBtn.push(subBtn);
                    }
                    this.button.push(new Button(button[i].name, button[i].type, {sub_button: topBtnSubBtn}));
                } else {
                    this.button.push(new Button(button[i].name, button[i].type, button[i]));
                }
            }
        },
        pushButton: function (button) {
            if (!button.isButton) {
                _err('Button list must be an array of Button');
            }
            this.button.push(button);
        },
        toObj: function () {
            var res = {button: []};
            for (var i = 0; i < this.button.length; ++i) {
                res.button.push(this.button[i].toObj())
            }
            return res;
        },
        toJson: function () {
            return JSON.stringify(this.toObj());
        },
        len: function (topIdx) {
            if (!topIdx) {
                return this.button.length;
            }
            if (topIdx >= this.button.length) {
                _err('TopIdx out of range.');
            }
            if (this.button[topIdx].isLeaf()) {
                _err('Button topIdx has no sub button.');
            }
            return this.button[topIdx].sub_button.length;
        },
        moveTopButton: function (oldTopIdx, newTopIdx) {
            if (Math.max(oldTopIdx, newTopIdx) >= this.len()) {
                _err('Top button idx out of range.');
            }
            var button = this.button.splice(oldTopIdx, 1)[0];
            this.button.splice(newTopIdx, 0, button);
        },
        moveSubButton: function (topIdx, oldSubIdx, newTopIdx) {
            if (topIdx >= this.button.length) {
                _err('Button topIdx is not top button');
            }

            this.button[topIdx].moveChild(oldSubIdx, newTopIdx);
        },
        get: function (topIdx, subIdx) {
            var btn = this.button[topIdx];
            btn = subIdx ? btn.sub_button[subIdx]: btn;
            return btn.toObj();
        }
    };

    function MenuView(menu, options) {
        if(!menu.isMenu){
            menu = new Menu(menu);
        }

        this.menu = menu;  // menu obj
        this.options = options = _extend({}, options);

        // Default options
        var defaults = {
            containerId: containerId,
            clickBtn: clickBtn
        };

        // Set default options
        for (var name in defaults) {
            !(name in options) && (options[name] = defaults[name]);
        }

        this.el = document.getElementById(this.options.containerId);  // root element
        this.el[expando] = this; // Export instance

        this.selectedBtn = null;
        this.el.className = topBtnUlCls;
        this.el.addEventListener('click', function (evt) {
            var menuView = this[expando],
                el = evt.target,
                idx = _getMenuIdx(el);
            if(_isCreateBtn(el)) {
                var name = '新建菜单';
                var type = 'view';
                var props = {url: 'http://xueersi.com'};
                if(_isTopBtn(el)) {
                    menuView.menu.button.push(new Button(name, type, props));
                    menuView._appendTopBtn(name, true);
                    if(menuView.menu.button.length >= 3){
                        el.parentElement.remove();
                    }
                    menuView._reIndex();
                } else {
                    if(menuView.menu.button[idx[0]].type !== 'top'){
                        menuView.menu.button[idx[0]].setProps('top', {sub_button: [new Button(name, type, props)]});
                    } else {
                        menuView.menu.button[idx[0]].sub_button.push(new Button(name, type, props));
                    }
                    menuView._appendSubBtn(idx[0], name);
                    el.remove();
                    if(menuView.menu.button[idx[0]].sub_button.length < 5){
                        menuView._appendCreateSubBtn(idx[0]);
                    }
                    menuView._reIndex();
                }
            } else if (_isBtn(el)) {
                if (menuView.selectedBtn) {
                    _toggleClass(menuView.selectedBtn, selectedBtnElCls, false);
                }
                _toggleClass(el, selectedBtnElCls, true);
                menuView.selectedBtn = el;

                menuView.options.clickBtn(idx, menuView.menu.get(...idx));
            }
        });

        for (var i = 0; i < menu.button.length; ++i ) {
            this._appendTopBtn(menu.button[i].name);
            var subBtnUl = this._getSubBtnUl(i);
            for (var j = 0; menu.button[i].sub_button && j < menu.button[i].sub_button.length; ++j){
                subBtnUl.appendChild(this._createSubBtn(menu.button[i].sub_button[j].name));
            }
            if(!menu.button[i].sub_button || menu.button[i].sub_button.length < 5) {
                this._appendCreateSubBtn(i);
            }
        }
        if(menu.button.length < 3) {
            this.el.appendChild(this.__createAddTopBtn());
        }
        this._reIndex();
    }

    MenuView.prototype = {
        sortable: function (newStatus) {
            if (newStatus) {
                this._displayAddBtnEl(false);
                var that = this;
                this.sortableUlArr = [];
                this.sortableUlArr.push(new Sortable(this.el, {
                    animation: 300,
                    disabled: false,
                    onEnd: function (evt) {
                        that.menu.moveTopButton(evt.oldIndex, evt.newIndex);
                        that._reIndex();
                    }
                }));
                for (var i = 0; i < this.el.children.length; ++i) {
                    var subBtnUl = this._getSubBtnUl(i);
                    if (subBtnUl && subBtnUl.children.length > 0) {
                        this.sortableUlArr.push(new Sortable(subBtnUl, {
                            animation: 300,
                            disabled: false,
                            onEnd: function (evt) {
                                that.menu.moveSubButton(_getMenuIdx(evt.item)[0], evt.oldIndex, evt.newIndex);
                                that._reIndex();
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
        },

        getJson: function(){
          this.menu.getJSON();
        },

        getObj: function(){
          this.menu.getObj();
        },

        _appendTopBtn: function (name, withCreat) {
            var topBtn = this.__createTopBtn(name);
            var subBtnUl = this._createSubBtnUl();
            topBtn.appendChild(subBtnUl);
            if(withCreat){
                subBtnUl.appendChild(this.__createAddSubBtn());
            }
            this.el.appendChild(topBtn);
        },

        __createTopBtn: function (name) {
            var topBtn = document.createElement(topBtnElTag);
            topBtn.className = topBtnElCls;
            var topBtnNameEl = document.createElement(topBtnNameElTag);
            topBtnNameEl.className = topBtnNameElCls;
            topBtnNameEl.innerHTML = name;
            _isBtn(topBtnNameEl, true);
            _isTopBtn(topBtnNameEl, true);
            topBtn.appendChild(topBtnNameEl);
            return topBtn;
        },

        _appendCreateSubBtn: function(topIdx) {
            var subBtnIdx = this._getSubBtnUl(topIdx);
            subBtnIdx.appendChild(this.__createAddSubBtn());
        },

        _appendSubBtn: function(topIdx, name){
            var subBtnIdx = this._getSubBtnUl(topIdx);
            subBtnIdx.appendChild(this._createSubBtn(name));
        },

        _createSubBtnUl: function () {
            var subBtnUl = document.createElement(subBtnUlTag);
            subBtnUl.className = subBtnUlCls;
            return subBtnUl;
        },

        _createSubBtn: function (name) {
            var subBtnEl = document.createElement(subBtnElTag);
            subBtnEl.className = subBtnElCls;
            subBtnEl.innerHTML = name;
            _isBtn(subBtnEl, true);
            return subBtnEl;
        },

        __createAddSubBtn: function () {
            var addSubBtnEl = document.createElement(addSubBtnElTag);
            addSubBtnEl.className = createSubBtnElCls;
            _isCreateBtn(addSubBtnEl, true);
            return addSubBtnEl;
        },

        __createAddTopBtn: function () {
            var addTopBtnEl = document.createElement(addTopBtnElTag);
            addTopBtnEl.className = createTopBtnElCls;
            var addTopBtnNameEl = document.createElement(topBtnNameElTag);
            addTopBtnNameEl.className = createTopBtnNameElCls;
            addTopBtnNameEl.innerHTML = 'new';
            addTopBtnEl.appendChild(addTopBtnNameEl);
            _isCreateBtn(addTopBtnNameEl, true);
            _isTopBtn(addTopBtnNameEl, true);
            this.el.appendChild(addTopBtnEl);
            return addTopBtnEl;
        },

        _getSubBtnUl: function (topBtnIdx) {
            return this.el.children[topBtnIdx].children[1];
        },

        _getBtnEl: function (topIdx, subIdx) {
            if (topIdx >= this.el.children.length) {
                _err('TopBtnIdx out of range.');
            }
            if (subIdx === undefined) {
                return this.el.children[topIdx].children[0];
            }
            var subBtnUl = this._getSubBtnUl(topIdx);
            if (subIdx >= subBtnUl.children.length) {
                _err('subIdx out of range.');
            }
            return subBtnUl.children[subIdx];
        },

        _reIndex: function (topBtnUl) {
            for (var i = 0; i < this.el.children.length; ++i) {
                var topBtnEl = this.el.children[i];
                // if (_isCreateBtn(topBtnEl)) continue;
                _setMenuIdx(topBtnEl.children[0], i);
                var subBtnUl = this._getSubBtnUl(i);
                for (var j = 0; subBtnUl && j < subBtnUl.children.length; ++j) {
                    // if (_isCreateBtn(subBtnUl.children[j])) continue;
                    _setMenuIdx(subBtnUl.children[j], i, j);
                }
            }
        },

        _displayAddBtnEl: function (display) {
            if (_isCreateBtn(this.el.lastChild)) {
                this.el.lastChild.style.display = display ? null : 'none';
            }
            for (var i = 0; this.el.children && i < this.el.children.length; ++i) {
                var subBtnUl = this._getSubBtnUl(i);
                if (subBtnUl && _isCreateBtn(subBtnUl.lastChild)) {
                    subBtnUl.lastChild.style.display = display ? null : 'none';
                }
            }
        },
    };

    // Export
    Menu.version = '1.0.1';
    return [Menu, Button, MenuView];
});