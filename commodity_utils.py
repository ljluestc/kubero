import polars as pl

def make_shifted_labels(train_labels: pl.DataFrame, target_pairs: pl.DataFrame, num_targets: int):
    # Build a dict of lag per target
    target_to_lag = (
        target_pairs.select(["target", "lag"])
        .with_columns(pl.col("lag") + 1)
        .to_dict(as_series=False)
    )
    # Create shifted label columns in Polars
    shifted = []
    for i in range(num_targets):
        col = f"target_{i}"
        lag = target_to_lag["lag"][i]
        shifted.append(train_labels.select(pl.col(col).shift(lag).alias(col)))
    # Concatenate all shifted columns horizontally
    shifted_labels = pl.concat(shifted, how="horizontal")
    return shifted_labels

def get_X_all_and_test(train_df: pl.DataFrame, train_labels: pl.DataFrame, target_pairs: pl.DataFrame, num_targets: int, test_size: int = 90):
    # Create shifted label features in Polars
    shifted_labels = make_shifted_labels(train_labels, target_pairs, num_targets)
    # Concatenate features and shifted labels horizontally in Polars
    X_all = pl.concat([train_df, shifted_labels], how="horizontal")
    # Split into train and test
    X_train = X_all[:-test_size]
    X_test = X_all[-test_size:]
    return X_all, X_train, X_test

# Example usage:
# train_df = pl.read_csv("train.csv")
# train_labels = pl.read_csv("train_labels.csv")
# target_pairs = pl.read_csv("target_pairs.csv")
# X_all, X_train, X_test = get_X_all_and_test(train_df, train_labels, target_pairs, num_targets=424)

