{
    let view = {
        el: 'songBelongsList-displayArea',
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
            $el.html(this.template)
            let { songs } = data
            let liList = playLists.map(songs => {
                let $li = $('<ul></ul>').html(``)
            })
        }
    }
    let model = {
        data: {
            songs: []
        },
        findSongs(playlistId) {
            setTimeout(() => {
                let playlistResult = new AV.Object.createWithoutData(
                    'Playlist',
                    playlistId
                )
                var query = new AV.Query('playlistMap')
                query.equalTo('playlistPointer', playlistResult)
                songResult = query.find().then(playlistMap => {
                    playlistMap.forEach(scm => {
                        var songs = scm.get('songPointer')
                        this.model.searchSongs(songs)
                        /* this.model.data.songs.push(songs.id) */
                    })
                })
            }, 500)
        },
        searchSongs(songs) {
            var searchSong = new AV.Query('Song')
            searchSong.get(songs.id).then(function(songResults) {
                this.data.songs = songResults.map(songResult => {
                    return { id: songResult.id, ...songResult.attributes }
                })
                return songResults
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
        getAllPlaylistsInnerSong() {
            return this.model.find().then(() => {
                this.view.render(this.model.data)
            })
        },
        bindEvent() {
            window.eventHub.on('addSong', playlistId => {
                this.model.find(playlistId)
            })
            window.eventHub.on('renderPlaylist', selectedPlaylistId => {
                this.getAllPlaylistsInnerSong(selectedPlaylistId)
            })
        }
    }
    controller.init(view, model)
}
