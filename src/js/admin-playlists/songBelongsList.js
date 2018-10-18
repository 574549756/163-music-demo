{
    let view = {
        el: '.songBelongsList-displayArea',
        init() {
            this.$el = $(this.el)
        },
        template: `
        <ol class="playList-music">
            <ul v-for="playlist in playlists">
            </ul>
        </ol>
        `,
        render(data) {
            let $el = $(this.el)
            $el.html(this.templete)
            let { songs, selectedSongId } = data
            let liList = songs.map(song => {
                let $li = $('<ul></ul>')
                    .html(
                        `<svg class="icon" aria-hidden="true"><use xlink: href="#icon-wangyiyunyinyuemusic1193417easyiconnet"></use></svg>
                        <li>${
                            song.name
                        }</li><li><svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-micc"></use>
                        </svg>${song.artist}</li>`
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
                        this.data.templateArray.push(songResults)
                        return templateArray
                    })
                })
                let array = this.data.templateArray
                console.log(array)
                this.data.songs = array.map(song => {
                    return {
                        id: song.id,
                        ...song.attributes
                    }
                })
                console.log(this.data.songs)
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.bindEvent()
        },
        getAllPlaylistsInnerSong(playlistId) {
            return this.model.findSongs(playlistId).then(() => {
                this.view.render(this.model.data)
            })
        },
        bindEvent() {
            window.eventHub.on('addSong', playlistId => {
                this.getAllPlaylistsInnerSong(playlistId)
            })
            window.eventHub.on('selectPlaylist', selectedPlaylistId => {
                this.getAllPlaylistsInnerSong(selectedPlaylistId)
            })
        }
    }
    controller.init(view, model)
}
