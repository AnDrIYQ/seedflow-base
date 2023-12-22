<template>
    <v-form>
        <v-container>
            <v-row>
                <v-col cols="12" md="6">
                    <v-app-bar-title>Додати</v-app-bar-title>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" md="6">
                    <v-text-field v-model="seed.title" label="Назва" outlined></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field type="number" v-model="seed.price" label="Ціна" outlined></v-text-field>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" md="6">
                    <v-select v-model="seed.season" :items="seasonOptions" label="Сезон" outlined></v-select>
                </v-col>
                <v-col cols="12" md="6">
                    <v-select v-model="seed.sort" :items="sortOptions" label="Сорт" outlined></v-select>
                </v-col>
            </v-row>

            <v-row>
                <v-col md="6" cols="12">
                    <v-file-input :prepend-inner="false" v-model="seed.image" label="Зображення" outlined></v-file-input>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12">
                    <v-btn @click="saveSeed" color="primary" dark>Додати</v-btn>
                </v-col>
            </v-row>
            <v-snackbar
                v-model="error"
            >
                Заповніть необхідні поля
                <template #actions>
                    <v-btn
                        color="pink"
                        variant="text"
                        @click="error = false"
                    >
                        Закрити
                    </v-btn>
                </template>
            </v-snackbar>
        </v-container>
    </v-form>
</template>

<script>
import { mapActions } from "vuex";

export default {
    data() {
        return {
            error: false,
            seed: {
                title: '',
                price: '',
                season: null,
                sort: null,
                image: null,
            },
            seasonOptions: ['Ранній', 'Середньо-ранній', 'Середньо-стиглий'],
            sortOptions: ['Насіння салату', 'Насіння моркви', 'Насіння кабачків', 'Насіння огірків'],
        };
    },
    methods: {
        ...mapActions('seeds', ['addItem']),
        addSeed(data) {
            this.addItem(data);
        },
        showError() {
            this.error = true;
            setTimeout(() => {
                this.error = false;
            }, 4000);
        },
        saveSeed() {
            if (this.seed.title && this.seed.price && this.seed.season && this.seed.sort) {
                this.addSeed(this.seed);
                this.seed = {
                    title: '',
                    price: '',
                    season: null,
                    sort: null,
                    image: null,
                };
            } else {
                this.showError();
            }
        },
    },
};
</script>

<style scoped>
/* Додайте стилі за бажанням для темних кольорів */
</style>
