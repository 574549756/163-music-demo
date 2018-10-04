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
        }
    }
    let model = {
        data: [],
        search: name => {
            var query = new AV.Query('Song')
            query.contains('name', name)
            query.find().then(function(results) {
                $('#searchResult').empty()
                if (results.length === 0) {
                    $('#searchResult').html('没有结果')
                } else {
                    for (var i = 0; i < results.length; i++) {
                        let song = results[i]
                        let li = `<li data-id="${song.id}">${
                            song.attributes.name
                        } - ${song.attributes.artist}
                            </li>`
                        $('#searchResult').append(li)
                    }
                }
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
                let value = $input.val().trim()
                if (value === '') {
                    return
                }
                this.model.search(value)
            })
        }
    }
    controller.init(view, model)
}
