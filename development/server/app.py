from flask import Flask, request
from sgnlp.models.csgec import (
    CsgConfig,
    CsgModel,
    CsgTokenizer,
    CsgecPreprocessor,
    CsgecPostprocessor,
    download_tokenizer_files,
)
from sgnlp.models.coherence_momentum import CoherenceMomentumModel, CoherenceMomentumConfig, \
    CoherenceMomentumPreprocessor

app = Flask(__name__)

config = CsgConfig.from_pretrained("https://storage.googleapis.com/sgnlp/models/csgec/config.json")
model = CsgModel.from_pretrained(
    "https://storage.googleapis.com/sgnlp/models/csgec/pytorch_model.bin",
    config=config,
)
download_tokenizer_files(
    "https://storage.googleapis.com/sgnlp/models/csgec/src_tokenizer/",
    "csgec_src_tokenizer",
)
download_tokenizer_files(
    "https://storage.googleapis.com/sgnlp/models/csgec/ctx_tokenizer/",
    "csgec_ctx_tokenizer",
)
download_tokenizer_files(
    "https://storage.googleapis.com/sgnlp/models/csgec/tgt_tokenizer/",
    "csgec_tgt_tokenizer",
)
src_tokenizer = CsgTokenizer.from_pretrained("csgec_src_tokenizer")
ctx_tokenizer = CsgTokenizer.from_pretrained("csgec_ctx_tokenizer")
tgt_tokenizer = CsgTokenizer.from_pretrained("csgec_tgt_tokenizer")

preprocessor = CsgecPreprocessor(src_tokenizer=src_tokenizer, ctx_tokenizer=ctx_tokenizer)
postprocessor = CsgecPostprocessor(tgt_tokenizer=tgt_tokenizer)

config1 = CoherenceMomentumConfig.from_pretrained(
    "https://storage.googleapis.com/sgnlp/models/coherence_momentum/config.json"
)
model1 = CoherenceMomentumModel.from_pretrained(
    "https://storage.googleapis.com/sgnlp/models/coherence_momentum/pytorch_model.bin",
    config=config1
)

preprocessor1 = CoherenceMomentumPreprocessor(config1.model_size, config1.max_len)

@app.route('/grammar', methods=['GET'])
def grammar():
    text = request.args.get("text")
    batch_source_ids, batch_context_ids = preprocessor([text])
    predicted_ids = model.decode(batch_source_ids, batch_context_ids)
    predicted_texts = postprocessor(predicted_ids)
    return predicted_texts[0]

@app.route("/coherence", methods=["GET"])
def coherence():
    text = request.args.get("text")
    text1_tensor = preprocessor1([text])

    text1_score = model1.get_main_score(text1_tensor["tokenized_texts"]).item()

    return text1_score


if __name__ == '__main__':
    app.run()
