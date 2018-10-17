{
    let view = {
        el: 'songBelongsList-displayArea',
        init() {
            this.$el = $(this.el)
        },
        template: `
        <ul class="playList-music">
            <ul v-for="playlist in playlists">
            </ul>
        </ul>
        `
    }
    let model = {
        data: {}
    }
    let controller = {}
}
