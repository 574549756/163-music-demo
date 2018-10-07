{
    let view = {
        el: '#musicList-container',
        templete: `
        <ul class="musicList">
                    <li v-for="musiclist in musiclists">
                    </li>
                </ul>
        `,
        render(data) {
            let $el = $(this.el)
            $el.html(this.templete)
            let { musiclists, selectedPlaylistId } = data
            let liList = musiclists.map(musiclist => {
                let $li = $('<li></li>')
                    .text(musiclist.name)
                    .attr('data-musiclist-id', musiclist.id)
                if (musiclist.id === selectedPlaylistId) {
                    $li.addClass('active')
                }
                return $li
            })
            $el.find('ul').empty()
            liList.map(domLi => {
                $el.find('ul').append(domLi)
            })
        },
        clearActive() {
            $(this.el)
                .find('.active')
                .removeClass('active')
        }
    }
    let model = {
        data: {
            musiclists: [],
            selectedPlaylistId: undefined
        },
        find() {
            var query = new AV.Query('Playlist')
            return query.find().then(musiclists => {
                this.data.musiclists = musiclists.map(musiclist => {
                    return { id: musiclist.id, ...musiclist.attributes }
                })
                return musiclists
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
            this.bindEventHub()
            this.getAllPlaylists()
        },
        getAllPlaylists() {
            return this.model.find().then(() => {
                this.view.render(this.model.data)
            })
        },
        bindEvents() {
            $(this.view.el).on('click', 'li', e => {
                let musiclistId = e.currentTarget.getAttribute(
                    'data-musiclist-id'
                )

                // 记录　渲染
                this.model.data.selectedPlaylistId = musiclistId
                this.view.render(this.model.data)

                let data
                let musiclists = this.model.data.musiclists
                for (let i = 0; i < musiclists.length; i++) {
                    if (musiclists[i].id === musiclistId) {
                        data = musiclists[i]
                        break
                    }
                }
                let object = JSON.parse(JSON.stringify(data))
                window.eventHub.emit('select', object)
            })
        },
        bindEventHub() {
            window.eventHub.on('create', musiclistData => {
                this.model.data.musiclists.push(musiclistData)
                this.view.render(this.model.data)
            })
            window.eventHub.on('new', () => {
                this.view.clearActive()
            })
            window.eventHub.on('update', musiclist => {
                let musiclists = this.model.data.musiclists
                for (let i = 0; i < musiclists.length; i++) {
                    if (musiclists[i].id === musiclist.id) {
                        Object.assign(musiclists[i], musiclist)
                    }
                }
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view, model)
}
