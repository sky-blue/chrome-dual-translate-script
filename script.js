// ==UserScript==
// @name         双语对照翻译
// @namespace    https://github.com/Roiocam/chrome-dual-translate-script
// @version      0.2
// @description  让谷歌浏览器原生翻译支持双语显示.只会匹配 docs 的结果
// @author       AndyChen
// @include      /^(http(s)?:\/\/)(doc(s)?).*$/
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?domain=appinn.net
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    const liChild = ['#text', 'SPAN', 'EM', 'FONT', 'STRONG', 'CODE', 'A'];
    let btn = document.createElement("button");
    btn.id = "dual";
    addGlobalStyle(".dual-css{border:0;width:3.33rem;height:3.33rem;border-radius:50%;box-shadow:0 10px 30px #aaa;background-color:green;display:block;position:fixed;bottom:1.33rem;right:1.33rem}.dual-css:active{background-color:red}")
    btn.className = "dual-css";
    btn.onclick = function () {
        if ( document.getElementById("U2U1AdzQf13") != null ) {
            while (document.getElementsByClassName("dual-1jk139").length !== 0){
                let arr = document.getElementsByClassName("dual-1jk139")
                for (const child of arr) {
                    child.remove();
                }
            }
            document.getElementById("U2U1AdzQf13").remove();
            return;
        }

        // 不翻译代码, 如 Netty
        for (const node of document.querySelectorAll('pre')) {
            node.setAttribute('translate', 'no');
        }

        function copy(node) {
            const copy = document.createElement(node.nodeName);
            copy.textContent = node.textContent;
            // copy.style.opacity = 0.74;
            copy.style.fontFamily = "华文细墨"
            copy.style.fontWeight = "bold"
            copy.classList.add("dual-1jk139");
            node.parentElement.insertBefore(copy, node.nextElementSibling);
            node.setAttribute('translate', 'no');
        }

        // 正文支持双语
        for (const node of document.querySelectorAll('p')) {
            copy(node);
        }

        // 标题支持双语
        for (const node of document.querySelectorAll('h1, h2, h3, h4, h5, h6')) {
            copy(node);
        }

        for (const node of document.querySelectorAll('ol')) {
            node.setAttribute('translate', 'no');
            for (const child of node.childNodes) {
                let dupNode;
                if (child.nodeType === Node.TEXT_NODE) {
                    dupNode = document.createElement('FONT');
                    dupNode.textContent = child.textContent;
                } else {
                    dupNode = child.cloneNode(true);
                }
                dupNode.setAttribute('translate', 'yes');
                // dupNode.style.opacity = 0.74;
                dupNode.style.fontFamily = "华文细墨"
                dupNode.style.fontWeight = "bold"
                dupNode.classList.add("dual-1jk139");
                node.append(dupNode);
            }
        }

        // 对于链接, 则使用行内元素双语, 适合目录结构
        for (const node of document.querySelectorAll('a')) {
            // 只更新单个超链接
            if (null === node.previousSibling && null === node.nextElementSibling) {
                const copy = document.createElement('FONT');
                copy.textContent = '  ' + node.textContent;
                copy.setAttribute('translate', 'yes');
                // copy.style.opacity = 0.74;
                copy.style.fontFamily = "华文细墨"
                copy.style.fontWeight = "bold"
                copy.classList.add("dual-1jk139");
                node.append(copy);
                node.setAttribute('translate', 'no');
            } else {
                // 属于多元素的行内，则另外处理这种情况.
            }
        }

        // 对于标签, 以两种方式区分
        for (const node of document.querySelectorAll('li')) {
            const firstChild = node.childNodes[0];
            // 对于只有一个元素的列表元素, 则为行内双语
            if (node.childNodes.length === 1 || node.textContent.length < 75) {
                // 处理多元素中文字较少的类型.
                if (node.childNodes.length > 1) {
                    const spiltNode = document.createElement('FONT');
                    spiltNode.textContent = ' ';
                    spiltNode.classList.add("dual-1jk139");
                    node.append(spiltNode);
                    node.setAttribute('translate', 'no');
                    let appendNodes = [];
                    for (const child of node.childNodes) {
                        let dupNode;
                        if (child.nodeType === Node.TEXT_NODE) {
                            dupNode = document.createElement('FONT');
                            dupNode.textContent = child.textContent;
                        } else {
                            dupNode = child.cloneNode(true);
                        }
                        dupNode.setAttribute('translate', 'yes');
                        // dupNode.style.opacity = 0.74;
                        dupNode.style.fontFamily = "华文细墨"
                        dupNode.style.fontWeight = "bold"
                        dupNode.classList.add("dual-1jk139");
                        appendNodes.push(dupNode);
                    }
                    for (const item of appendNodes) {
                        node.append(item);
                    }
                } else {
                    if (firstChild.nodeType === Node.TEXT_NODE) {
                        const content = node.textContent;
                        const copy = document.createElement('FONT');
                        copy.textContent = '  ' + content;
                        copy.setAttribute('translate', 'yes');
                        // copy.style.opacity = 0.74;
                        copy.style.fontFamily = "华文细墨"
                        copy.style.fontWeight = "bold"
                        copy.classList.add("dual-1jk139");
                        node.append(copy);
                        node.setAttribute('translate', 'no');
                    } else if (firstChild.nodeName === 'UL') {
                        // 不处理多层链接
                    }
                }
            } else {
                // 对于多个元素, 判断是否为文字类型, 如果是, 添加类似 p 标签的处理
                let flag = true;
                for (const childNode of node.childNodes) {
                    if (!liChild.includes(childNode.nodeName)) {
                        flag = false;
                    }
                }

                if (flag) {
                    copy(node);
                }
            }
        }

        let flagDiv = document.createElement("DIV");
        flagDiv.id = "U2U1AdzQf13";
        document.body.append(flagDiv);
    }

    document.body.append(btn);

    function addGlobalStyle(css) {
        let head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.innerHTML = css;
        head.appendChild(style);
    }
})();
