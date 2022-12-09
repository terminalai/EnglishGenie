from flask import Flask, request
import tensorflow as tf

app = Flask(__name__)

def read(filename):
    text = ""
    with open(filename) as file: text = file.read()
    return text


tokenizer = tf.keras.preprocessing.text.tokenizer_from_json(read("models/tokenizer.json"))

model = tf.keras.Sequential([
    tf.keras.layers.Embedding(2000, 64), # embedding layer
    tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(64, dropout=0.2, recurrent_dropout=0.2)), # LSTM layer
    tf.keras.layers.Dropout(rate=0.2), # dropout layer
    tf.keras.layers.Dense(64, activation='relu'), # fully connected layer
    tf.keras.layers.Dense(4, activation='sigmoid') # final layer
])

model.load_weights("models/mbti-bdlstm.h5")

@app.route('/')
def hello_world():
    return '<h1>Hello World!</h1>'

@app.route("/mbti", methods=["GET"])
def mbti():
    text = request.args.get("text")
    ei, sn, ft, jp = model.predict(tf.keras.preprocessing.sequence.pad_sequences(tokenizer.texts_to_sequences([text]), maxlen=100, padding='post', truncating='post')).round().astype(int)[0]
    print("IE"[ei]+"NS"[sn]+"TF"[ft]+"PJ"[jp])
    return "IE"[ei]+"NS"[sn]+"TF"[ft]+"PJ"[jp]


if __name__ == '__main__':
    app.run()
