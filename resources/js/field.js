Nova.booting((Vue, router) => {
    Vue.component('index-nova-belongsto-depends', require('./components/IndexField'));
    Vue.component('detail-nova-belongsto-depends', require('./components/DetailField'));
    Vue.component('form-nova-belongsto-depends', require('./components/FormField'));
});
