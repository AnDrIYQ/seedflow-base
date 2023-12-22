<template>
    <v-container>
        <seed-form></seed-form>
        <seed-table :seeds="getSeeds"></seed-table>
    </v-container>
</template>

<script>
import SeedForm from '@/components/SeedForm.vue';
import SeedTable from '@/components/SeedTable.vue';
import { mapActions, mapGetters } from "vuex";
export default {
    name: 'MainForm',
    data() {
        return {
            seeds: [],
        };
    },
    components: {
        SeedForm,
        SeedTable,
    },
    methods: {
        ...mapActions('seeds', ['subscribeOnChanges']),
    },
    computed: {
        ...mapGetters('seeds', ['getSeeds']),
    },
    created() {
        this.subscribeOnChanges();
    },
}
</script>