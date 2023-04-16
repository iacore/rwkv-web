Fancy RWKV client. [Preview](https://rwkv-web-01.surge.sh/) (may be out-of-date. Install this locally for best experience)

This application requires [rwkv-flask](https://github.com/iacore/rwkv-flask) running as the server. Go to that repo for installation guide.

## Installation

```
pnpm i
pnpm dev
```

## TODO

- cache last 16 states/logits
    facet by `n_vocab`, `n_state`, `seen_tokens`, also `model_path` as caution
    - resume from them
- use consistent wording

good to have

- scroll wheel zoom
- scroll wheel scroll canvas
- dynamic canvas background
- faster sampler
