'use strict';
import './style.css';
function createPagiDom() {
    let dom = document.createElement('div')
    dom.className = "pagination-nav"
    dom.innerHTML = '<ul class="pagination" id="pagination"></ul>';
    document.body.appendChild(dom);
    return dom;
}
class Panination {
    constructor(pagedom, tableObj) {
        this.paginationUl = pagedom;
        this.paginationUl.addEventListener('click', event => {
            let page = event.target.dataset.page;
            if (page === 'prev') {
                tableObj.curPage > 1 ? tableObj.updateTableRowsByPageNum(tableObj.curPage - 1, true) : null;
            } else if (page === 'next') {
                tableObj.curPage < tableObj.total ? tableObj.updateTableRowsByPageNum(tableObj.curPage + 1, true) : null;
            } else {
                this.clearLiActive();
                event.target.classList.add('active');
                tableObj.updateTableRowsByPageNum(parseInt(event.target.dataset.page), false)
            }
        })
    }
    // 清除li的active
    clearLiActive() {
        let activeli = Array.from(this.paginationUl.childNodes).filter(node => node.firstChild.className.includes('active'));
        activeli.length > 0 ? activeli[0].firstChild.classList.remove('active') : null;
    }

    createPagination(pageNum, activePage = 1) {
        let str = ''
        if (pageNum <= 5) {
            for (let i = 1; i <= pageNum; i++) {
                let className = i === activePage ? "page-link active" : "page-link"
                str += '<li class="page-item">' + '<a class="' + `${className}` + '" href="#" data-page=' + i + ' >' + i + '</a></li>'
            }
        } else {
            str += '<li class="page-item">' + '<a class="page-link" href="#" data-page=' + 'prev' + ' >' + '<' + '</a></li>'
            for (let i = Math.min(activePage, pageNum - 4); i < Math.min(5 + activePage, pageNum + 1); i++) {
                let className = i === activePage ? "page-link active" : "page-link"
                str += '<li class="page-item">' + '<a class="' + className + '" href="#" data-page=' + i + ' >' + i + '</a></li>'
            }
            str += '<li class="page-item">' + '<a class="page-link" href="#" data-page=' + 'next' + ' >' + '>' + '</a></li>'
        }
        this.paginationUl.innerHTML = str;
    }
}
class Simpletable {
    constructor(columns, pageSize, data) {
        this.columns = columns;
        this.pageSize = pageSize;
        this.curPage = 1;
        this.total = 1; // 总页数
        this.data = data;
        this.tableHeadDom = null;
        this.tableBodyDom = null;
        var paginationUl = document.getElementById('pagination') || createPagiDom()
        this.pageUtil = new Panination(paginationUl, this)
    }
    init(headDom, bodyDom) {
        this.tableHeadDom = headDom;
        this.tableBodyDom = bodyDom;
        this.iniTableHeader(this.tableHeadDom);
        this.updateTableRowsByPageNum(this.curPage);
    }

    iniTableHeader(target) {
        let str = '<tr>'
        for (let item of this.columns) {
            str += '<th>' + item.title + '</th>'
        }
        target.innerHTML = str + '</tr>'
    }
    createTableRowsToTarget(target, data) {
        let arr = []
        for (let i = 0, size = data.length; i < size; i++) {
            let str = '<tr>';
            for (let item of this.columns) {
                str += '<td>' + data[i][item.field] + '</td>'
            }
            arr.push(str.concat('</tr>'))
        }
        target.innerHTML = arr.join('')
    }
    //更新第pageNo页数据,第二个参数代表更新分页
    updateTableRowsByPageNum(pageNo, updatePagination = true) {
        console.log(pageNo, this.data, this.pageSize, updatePagination)
        this.curPage = pageNo;
        let pageNum = Math.ceil(this.data.length / this.pageSize);
        if (pageNum !== this.total) {
            this.total = pageNum;
        }
        if (pageNum >= 2) {
            updatePagination && this.pageUtil.createPagination(pageNum, pageNo)
        }
        this.createTableRowsToTarget(this.tableBodyDom, this.data.slice((pageNo - 1) * this.pageSize, pageNo * this.pageSize))
    }
}

module.exports = Simpletable;
