export type FunctionalCallback<D, R> = (data: D) => R;
export type Callback<D> = FunctionalCallback<D, void>;
