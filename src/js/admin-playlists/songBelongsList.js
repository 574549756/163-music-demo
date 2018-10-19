{
    let view = {
        el: '.songBelongsList-displayArea',
        init() {
            this.$el = $(this.el)
        },
        template: `
        <ul class="playList-music">
            <ul v-for="playlist in playlists">
            </ul>
        </ul>
        `,
        render(data) {
            let $el = $(this.el)
            $el.html(this.template)
            let liList = data.songs.map(song => {
                let $li = $('<ul></ul>')
                    .html(
                        `<svg class="icon" aria-hidden="true"><use xlink: href="#icon-wangyiyunyinyuemusic1193417easyiconnet"></use></svg>
                        <li>${
                            song.attributes.name
                        }</li><li><svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-micc"></use>
                        </svg>${song.attributes.artist}</li>`
                    )
                    .attr('data-song-id', song.id)
                return $li
            })

            $el.find('.playList-music').empty()
            liList.map(domLi => {
                $el.find('.playList-music').append(domLi)
            })
        }
    }
    let model = {
        data: {
            songs: [],
            templateArray: []
        },
        findSongs(playlistId) {
            let playlistResult = new AV.Object.createWithoutData(
                'Playlist',
                playlistId
            )
            var query = new AV.Query('playlistMap')
            query.equalTo('playlistPointer', playlistResult)
            return query.find().then(playlistMap => {
                playlistMap.forEach(scm => {
                    var songs = scm.get('songPointer')
                    var searchSong = new AV.Query('Song')
                    searchSong.get(songs.id).then(songResults => {
                        this.data.songs.push(songResults)
                        return songs
                    })
                })
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.bindEvent()
        },
        getAllPlaylistsInnerSong(playlistId) {
            this.model.findSongs(playlistId)
            this.view.render(this.model.data)
        },
        bindEvent() {
            window.eventHub.on('addSong', playlistId => {
                this.getAllPlaylistsInnerSong(playlistId)
            })
            window.eventHub.on('select', selectedPlaylistId => {
                this.getAllPlaylistsInnerSong(selectedPlaylistId.id)
            })
        }
    }
    controller.init(view, model)
}
