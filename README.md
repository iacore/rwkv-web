Fancy RWKV client. [Preview](https://rwkv-web-01.surge.sh/) (may be out-of-date. Install this locally for best experience)

This application requires [rwkv-flask](https://github.com/iacore/rwkv-flask) running as the server. Go to that repo for installation guide.

## Installation

```
pnpm i
pnpm dev
```

## Notes

RWKV is easy to model as pure functions. Therefore, it's easy reconstruct the state from prompt. It's also possible to cache infer results in a radix tree/cactus stack. The tokens used so far is much smaller (in bytes) than model hidden state.

For explanation of RWKV itself, see [How the RWKV language model works](https://johanwind.github.io/2023/03/23/rwkv_details.html) and [numpy implementation](https://github.com/iacore/rwkv-np) (used in server of this project).

High level representation of RWKV API is presented below.

```lean
-- pseudo-code for RWKV inference

structure Shape where -- model shape
  n_vocab: Nat
  n_embed: Nat
  n_layer: Nat

def Token (S: Shape) := Fin S.n_vocab

-- np.zeros
def zeros {S: Shape} : HiddenState S
  := ...
def infer {S: Shape} : ModelWeights S -> HiddenState S -> Token S -> HiddenState S
  := ...

def infer_batch : ModelWeights S -> HiddenState S -> List (Token S) -> HiddenState S
| _ [] s => s
| w (x::xs) s => infer_batch w (infer w s x) xs

def infer_from_zero : ModelWeights S -> List Token -> HiddenState S
| w tokens => infer_batch w zeros tokens
```

## TODO

not sure whether full auto or manual request is good

- add cache tests
- fix all type errors
- add tokenizer and client as svelte Context (Promise<T>)
- cache invalidation
- write about rwkvd
- use consistent wording

good to have

- scroll wheel zoom
- scroll wheel scroll canvas
- dynamic canvas background
- faster sampler
