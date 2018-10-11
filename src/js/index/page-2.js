{
    let view = {
        el: '.page-2',
        init() {
            this.$el = $(this.el)
        },
        show() {
            this.$el.addClass('active')
        },
        hide() {
            this.$el.removeClass('active')
        }
    }
    let model = {}
    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            this.bindEventHub()
        },
        bindEventHub() {
            window.eventHub.on('selectTab', tabName => {
                if (tabName === 'page-2') {
                    this.view.show()
                    this.hotDate()
                } else {
                    this.view.hide()
                }
            })
        },
        hotDate() {
            var date = new Date()
            $('#hotTime').text(
                `更新日期：${date.getMonth() + 1}月${date.getDate()}日`
            )
        }
    }
    controller.init(view, model)
}
