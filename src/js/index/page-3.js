{
    let view = {
        el: '.page-3',
        init() {
            this.$el = $(this.el)
        },
        show() {
            this.$el.addClass('active')
        },
        hide() {
            this.$el.removeClass('active')
        },
        displayResult(li) {
            $('#searchResult').append(li)
        },
        noResult() {
            $('#searchResult').html('没有结果')
        }
    }
    let model = {
        search(name) {
            var query = new AV.Query('Song')
            query.contains('name', name)
            query.find().then(result => {
                return result
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            this.bindEvent()
        },
        bindEvent() {
            window.eventHub.on('selectTab', tabName => {
                if (tabName === 'page-3') {
                    this.view.show()
                } else {
                    this.view.hide()
                }
            })
            $('input#search').on('input', e => {
                let $input = $(e.currentTarget)
                let value = $input.val()
                let result = this.model.search(value)
            })
            function checkResult(result) {
                if (result.length === 0) {
                    this.view.noResult()
                } else {
                    for (var i = 0; i < result.length; i++) {
                        let li = `
                    <li data-id="${result[i].objectId}">
                        ${result[i].name} - ${result[i].artist}
                    </li>
                    `
                        this.view.displayResult(li)
                    }
                }
            }
        }
    }
    controller.init(view, model)
}
