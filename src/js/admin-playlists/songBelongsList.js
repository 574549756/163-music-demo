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
                        </svg>${song.attributes.artist}</li>
                        `
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
            templateMap: []
        },
        init() {
            this.data = {
                songs: [],
                templateMap: []
            }
        },
        findSongs(playlistId) {
            let playlistResult = new AV.Object.createWithoutData(
                'Playlist',
                playlistId
            )
            var query = new AV.Query('playlistMap')
            query.equalTo('playlistPointer', playlistResult)
            return query
                .find()
                .then(playlistMap => {
                    let songResultsId = []
                    playlistMap.forEach(scm => {
                        this.data.templateMap.push(scm.id)
                        var songs = scm.get('songPointer')
                        songResultsId.push(songs.id)
                    })
                    return songResultsId
                })
                .then(songResultsId => {
                    let songAfter = []
                    var searchSong = new AV.Query('Song')
                    songResultsId.map(songs => {
                        searchSong
                            .get(songs)
                            .then(songResult => {
                                return songResult
                            })
                            .then(songResult => {
                                songAfter.push(songResult)
                            })
                    })
                    return songAfter
                })
            /* .then(songAfter => {
                    setTimeout(() => {
                        this.data.songs = songAfter.map(song => {
                            return {
                                id: song.id,
                                ...song.attributes
                            }
                        })
                        console.log(this.data)
                    }, 0)
                }) */
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
        },
        bindEvent() {
            window.eventHub.on('addSong', playlistId => {
                this.getAllPlaylistsInnerSong(playlistId)
            })
            window.eventHub.on('select', selectedPlaylistId => {
                this.getAllPlaylistsInnerSong(selectedPlaylistId)
            })
        }
    }
    controller.init(view, model)
}
