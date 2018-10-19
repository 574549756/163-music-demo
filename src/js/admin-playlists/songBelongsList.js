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
            console.log(data.songs)
            let liList = data.songs.map(song => {
                let $li = $('<ul></ul>').html(
                    `<svg class="icon" aria-hidden="true"><use xlink: href="#icon-wangyiyunyinyuemusic1193417easyiconnet"></use></svg>
                        <li>${
                            song.attributes.name
                        }</li><li><svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-micc"></use>
                        </svg>${song.attributes.artist}</li>
                        `
                )
                return $li
            })
            console.log(liList)
            let liListAfter = data.templateMap.map(temp => {
                $(liList).attr('data-song-id', temp.id)
            })

            $el.find('.playList-music').empty()
            liListAfter.map(domLi => {
                $el.find('.playList-music').append(domLi)
            })
        }
    }
    let model = {
        data: {
            songs: [],
            templateMap: []
        },
        init() {
            this.data.songs = []
            this.data.templateMap = []
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
                    this.data.templateMap.push(scm)
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
            this.model.init()
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
