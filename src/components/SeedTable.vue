<template>
    <v-container>
        <v-app-bar-title>Фільтр</v-app-bar-title>
        <v-row>
            <v-col cols="12" md="6">
                <v-select
                    v-model="selectedSortFilter"
                    :items="sortFilterOptions"
                    label="За сортом"
                ></v-select>
            </v-col>
            <v-col cols="12" md="6">
                <v-select
                    v-model="selectedSeasonFilter"
                    :items="seasonFilterOptions"
                    label="За сезоном"
                ></v-select>
            </v-col>
        </v-row>
        <v-data-table :items="filteredSeeds" :headers="headers" item-key="id">
            <template v-slot:item="props">
                <tr>
                    <td>{{ props.item.title || '' }}</td>
                    <td>{{ props.item.price || '' }}</td>
                    <td>{{ props.item.season || '' }}</td>
                    <td>{{ props.item.sort || '' }}</td>
                    <td>
                        <v-img :src="props.item.image_url" max-width="250" max-height="400"></v-img>
                    </td>
                    <td>
                        <v-icon @click="showConfirmDialog(props.item.id)" color="red" dark>mdi-delete</v-icon>
                    </td>
                </tr>
            </template>
        </v-data-table>
        <v-dialog v-model="confirmDialog" max-width="500px">
            <v-card>
                <v-card-title>Підтвердіть видалення</v-card-title>
                <v-card-text>
                    Ви впевнені, що хочете видалити цей запис?
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="deleteConfirmed" color="error">Видалити</v-btn>
                    <v-btn @click="cancelDelete" color="primary">Скасувати</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import {mapActions} from "vuex";

export default {
    props: {
        seeds: Array,
    },
    data() {
        return {
            confirmDialog: false,
            itemToDelete: null,
            headers: [
                {text: 'Назва', value: 'title'},
                {text: 'Ціна', value: 'price'},
                {text: 'Сезон', value: 'season'},
                {text: 'Сорт', value: 'sort'},
                {text: 'Зображення', value: 'image'},
                {text: 'Дії', value: 'actions', sortable: false},
            ],

            selectedSortFilter: null,
            selectedSeasonFilter: null,

            sortFilterOptions: ["Всі", "Sort 1", "Sort 2", "Sort 3"],
            seasonFilterOptions: ["Всі", "Season 1", "Season 2", "Season 3"],
        };
    },
    computed: {
        filteredSeeds() {
            let filteredData = this.seeds;

            if (this.selectedSortFilter && this.selectedSortFilter !== "Всі") {
                filteredData = filteredData.filter((seed) => seed.sort === this.selectedSortFilter);
            }

            if (this.selectedSeasonFilter && this.selectedSeasonFilter !== "Всі") {
                filteredData = filteredData.filter((seed) => seed.season === this.selectedSeasonFilter);
            }

            return filteredData;
        },
    },
    methods: {
        showConfirmDialog(item) {
            this.itemToDelete = item;
            this.confirmDialog = true;
        },
        deleteConfirmed() {
            this.deleteSeed();
            this.confirmDialog = false;
            this.itemToDelete = null;
        },
        cancelDelete() {
            this.confirmDialog = false;
        },
        ...mapActions('seeds', ['removeItem']),
        deleteSeed() {
            this.removeItem(this.itemToDelete);
        },
    },
};
</script>