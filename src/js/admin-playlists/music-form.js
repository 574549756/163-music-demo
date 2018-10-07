{
    let view = {
        el: '.page > main',
        init() {
            this.$el = $(this.el)
        },
        template: `
            <form class=playlistForm>
                <div class="row">
                    <div class="row">
                        <label>
                            歌单名
                            <input type="text" name="name" value="__name__">
                        </label>
                    </div>
                    <div class="id">
                        <label>
                            歌单id
                            <input name="summary" value="__id__">
                        </label>
                    </div>
                    <div class="id">
                        <label>
                            封面
                            <input name="summary" value="__cover__">
                        </label>
                    </div>
                    <div class="row">
                        <label>
                            描述
                            <textarea name="summary" value="__summary__"></textarea>
                        </label>
                    </div>
                <div class="row actions">
                    <button type="submit">创建</button>
                </div>
            </form>
        `,
        render(data = {}) {
            let placeHolders = ['name', 'summary', 'id', 'cover']
            let html = this.template
            placeHolders.map(string => {
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
            if (data.id) {
                $(this.el).prepend('<h1>编辑歌单</h1>')
            } else {
                $(this.el).prepend('<h1>新建歌单</h1>')
            }
        },
        reset() {
            this.render({})
        }
    }
    let model = {
        data: {
            name: '',
            id: '',
            cover: '',
            summary: ''
        },
        update(data) {
            var playlist = AV.Object.createWithoutData('Playlist', this.data.id)
            playlist.set('name', data.name)
            playlist.set('id', data.id)
            playlist.set('summary', data.summary)
            playlist.set('cover', data.cover)
            return playlist.save().then(response => {
                Object.assign(this.data, data)
                return response
            })
        },
        create(data) {
            // 声明一个 Todo 类型
            var Playlist = AV.Object.extend('Playlist')
            // 新建一个 Todo 对象
            var playlist = new Playlist()
            playlist.set('name', data.name.replace('.mp3', ''))
            playlist.set('id', data.id)
            playlist.set('cover', data.cover)
            playlist.set('summary', data.summary)
            return playlist.save().then(
                newPlaylist => {
                    let { id, attributes } = newPlaylist
                    Object.assign(this.data, {
                        id: id,
                        ...attributes

                        /* name: attributes.name,
                        artist: attributes.artist,
                        id: attributes.id */
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
            this.view.render(this.model.data)
            this.bindEvents()
            window.eventHub.on('select', data => {
                this.model.data = data
                this.view.render(this.model.data)
            })
            window.eventHub.on('new', data => {
                if (this.model.data.id) {
                    this.model.data = {
                        name: '',
                        id: '',
                        cover: '',
                        summary: ''
                    }
                } else {
                    Object.assign(this.model.data, data)
                }
                this.view.render(this.model.data)
            })
        },
        reset(data) {
            this.view.render(data)
        },
        create() {
            let needs = 'name id cover summary'.split(' ')
            let data = {}
            needs.map(string => {
                data[string] = this.view.$el.find(`[name="${string}"]`).val()
            })
            this.model.create(data).then(() => {
                this.view.reset()
                let stringCopy = JSON.stringify(this.model.data)
                let objectCopy = JSON.parse(stringCopy)
                window.eventHub.emit('create', objectCopy)
            })
        },
        update() {
            let needs = 'name  id cover summary'.split(' ')
            let data = {}
            needs.map(string => {
                data[string] = this.view.$el.find(`[name="${string}"]`).val()
            })
            this.model.update(data).then(() => {
                window.eventHub.emit(
                    'update',
                    JSON.parse(JSON.stringify(this.model.data))
                )
            })
        },
        bindEvents() {
            this.view.$el.on('submit', 'form', e => {
                e.preventDefault()
                if (this.model.data.id) {
                    this.update()
                } else {
                    this.create()
                }
            })
        }
    }
    controller.init(view, model)
}
