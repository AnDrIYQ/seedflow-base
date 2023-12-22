const state = {
    seeds: [],
};

const mutations = {
    setSeeds(state, rows) {
        state.seeds = rows;
    },
};

const actions = {
    subscribeOnChanges({ commit }) {
        window.ipcRenderer.on('seeds-updated', () => {
            window.ipcRenderer.emit('fetch-seeds');
        });
        window.ipcRenderer.on('fetch-seeds-response', (rows) => {
            commit('setSeeds', rows);
        });
        window.ipcRenderer.emit('fetch-seeds');
    },
    removeItem(context, id) {
        window.ipcRenderer.emit('remove-seed', id);
    },
    addItem(context, params) {
        window.ipcRenderer.emit('add-seed', params);
    },
};

const getters = {
    getSeeds(state) {
        return state.seeds.map((item) => ({ ...item, actions: 'all' }));
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};