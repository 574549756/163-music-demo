{
    let view = {
        el: '.search-areasearch-area',
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
            var query1 = new AV.Query('Song')
            query1.contains('name', name)
            var query2 = new AV.Query('Song')
            query2.contains('artist', name)
            var query = AV.Query.or(query1, query2)
            query.find().then(function(results) {
                $('#searchResult').empty()
                if (results.length === 0) {
                    $('#searchResult').html('没有结果')
                } else {
                    for (var i = 0; i < results.length; i++) {
                        let song = results[i]
                        let li = `
                        <li data-id="${song.id}">
                            <a href="./song.html?id=${song.id}">${
                            song.attributes.name
                        } - ${song.attributes.artist}
                        </a>
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
            let timer = null
            $('input#search').on('input', e => {
                if (timer) {
                    window.clearTimeout(timer)
                }
                timer = setTimeout(() => {
                    console.log('时间到')
                    timer = null
                    let $input = $(e.currentTarget)
                    let value = $input.val().trim()
                    if (value === '') {
                        return
                    }
                    this.model.search(value)
                }, 400)
            })
        }
    }
    controller.init(view, model)
}
