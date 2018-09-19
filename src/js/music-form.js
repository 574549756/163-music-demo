{
    let view = {
        el: '.page > main',
        init() {
            this.$el = $(this.el)
        },
        template: `
        <h1>新建歌曲</h1>
            <form class=form>
                <div class="row">
                    <label for="">
                        歌名
                    </label>

                    <input name="name" type="text" value="__name__">
                </div>
                <div class="row">
                    <label for="">
                        歌手
                    </label>

                    <input name="artist" type="text" value="__artist__">
                </div>
                <div class="row">
                    <label for="">
                        外链
                    </label>

                    <input name="url" type="text" value="__url__">
                </div>
                <div class="row actions">
                    <button type="submit">保存</button>
                </div>
            </form>
        `,
        render(data = {}) {
            let placeHolders = ['name', 'url', 'artist', 'id']
            let html = this.template
            placeHolders.map(string => {
                html = html.replace(`__${string}__`, data[string] || '')
            })

            $(this.el).html(html)
        },
        reset() {
            this.render({})
        }
    }
    let model = {
        data: {
            name: '',
            artist: '',
            url: '',
            id: ''
        },
        create(data) {
            // 声明一个 Todo 类型
            var Song = AV.Object.extend('Song')
            // 新建一个 Todo 对象
            var song = new Song()
            song.set('name', data.name)
            song.set('artist', data.artist)
            song.set('url', data.url)
            return song.save().then(
                newSong => {
                    let { id, attributes } = newSong
                    Object.assign(this.data, {
                        id: id,
                        ...attributes

                        /* name: attributes.name,
                        artist: attributes.artist,
                        url: attributes.url */
                    })
                },
                error => {
                    // 异常处理
                    console.error(error.message)
                }
            )
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            this.bindEvents()
            this.view.render(this.model.data)
            window.eventHub.on('upload', data => {
                this.reset(data)
            })
        },
        reset(data) {
            this.view.render(data)
        },
        bindEvents() {
            this.view.$el.on('submit', 'form', e => {
                e.preventDefault()
                let needs = 'name artist url'.split(' ')
                let data = {}
                needs.map(string => {
                    data[string] = this.view.$el
                        .find(`[name="${string}"]`)
                        .val()
                })
                this.model.create(data).then(() => {
                    this.view.reset()
                    let stringCopy = JSON.stringify(this.model.data)
                    let objectCopy = JSON.parse(stringCopy)
                    window.eventHub.emit('create', objectCopy)
                })
            })
        }
    }
    controller.init(view, model)
}
