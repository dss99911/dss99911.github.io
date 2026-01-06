---
layout: post
title: "머신러닝 개발 환경 설정: Anaconda와 Jupyter Notebook"
date: 2025-12-28 12:02:00 +0900
categories: [knowledge, ai]
tags: [anaconda, jupyter-notebook, tensorflow, python, ml-environment]
description: "Anaconda와 Jupyter Notebook을 이용한 머신러닝 개발 환경 구축 방법과 TensorFlow 예제를 소개합니다."
image: /assets/images/posts/thumbnails/2025-12-28-ml-dev-environment.png
---

## Anaconda

Anaconda는 데이터 사이언스와 머신러닝을 위한 Python/R 배포판입니다.

### 주요 특징

- 패키지 및 환경 관리
- 1,500개 이상의 과학 패키지 포함
- conda 명령어로 쉬운 패키지 설치

### 설치

[Anaconda 공식 사이트](https://www.anaconda.com/download/)에서 다운로드

### 기본 명령어

```bash
# 환경 생성
conda create -n myenv python=3.9

# 환경 활성화
conda activate myenv

# 패키지 설치
conda install numpy pandas scikit-learn

# 환경 목록 확인
conda env list

# 환경 제거
conda env remove -n myenv
```

---

## Jupyter Notebook

### 설치 및 실행

```bash
# 설치
pip install jupyter

# 실행
jupyter notebook
```

### 주요 기능

- **대화형 코딩**: 셀 단위로 코드 실행
- **시각화**: matplotlib, seaborn 등 직접 렌더링
- **마크다운 지원**: 문서화와 코드 통합
- **공유 용이**: .ipynb 파일로 저장 및 공유

### 유용한 단축키

| 단축키 | 기능 |
|--------|------|
| `Shift + Enter` | 셀 실행 후 다음 셀로 이동 |
| `Ctrl + Enter` | 현재 셀 실행 |
| `Esc + A` | 위에 새 셀 추가 |
| `Esc + B` | 아래에 새 셀 추가 |
| `Esc + D, D` | 셀 삭제 |
| `Esc + M` | 마크다운 셀로 변환 |
| `Esc + Y` | 코드 셀로 변환 |

### Jupyter 확장 프로그램

```bash
pip install jupyter_contrib_nbextensions
jupyter contrib nbextension install --user
```

유용한 확장:
- Table of Contents
- Variable Inspector
- ExecuteTime
- Autopep8

---

## TensorFlow 예제

### 설치

```bash
pip install tensorflow
```

### 기본 예제: 선형 회귀

```python
import tensorflow as tf
import numpy as np

# 샘플 데이터 생성
X_train = np.array([1, 2, 3, 4, 5], dtype=float)
y_train = np.array([2, 4, 6, 8, 10], dtype=float)  # y = 2x

# 모델 정의
model = tf.keras.Sequential([
    tf.keras.layers.Dense(units=1, input_shape=[1])
])

# 모델 컴파일
model.compile(
    optimizer='sgd',
    loss='mean_squared_error'
)

# 학습
model.fit(X_train, y_train, epochs=500, verbose=0)

# 예측
print(model.predict([6.0]))  # 약 12에 가까운 값 출력
```

### 이미지 분류 예제 (MNIST)

```python
import tensorflow as tf

# 데이터 로드
mnist = tf.keras.datasets.mnist
(x_train, y_train), (x_test, y_test) = mnist.load_data()

# 정규화
x_train, x_test = x_train / 255.0, x_test / 255.0

# 모델 구성
model = tf.keras.Sequential([
    tf.keras.layers.Flatten(input_shape=(28, 28)),
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(10, activation='softmax')
])

# 컴파일
model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

# 학습
model.fit(x_train, y_train, epochs=5)

# 평가
model.evaluate(x_test, y_test)
```

---

## 개발 환경 구성 팁

### GPU 설정 (NVIDIA)

```bash
# CUDA 및 cuDNN 설치 후
pip install tensorflow-gpu
```

### 메모리 관리

```python
# GPU 메모리 성장 허용
gpus = tf.config.experimental.list_physical_devices('GPU')
if gpus:
    for gpu in gpus:
        tf.config.experimental.set_memory_growth(gpu, True)
```

### 가상환경 추천 설정

```bash
# ML 프로젝트용 환경
conda create -n ml python=3.9
conda activate ml
pip install tensorflow numpy pandas matplotlib scikit-learn jupyter
```

---

## 추가 리소스

- [TensorFlow 공식 튜토리얼](https://www.tensorflow.org/tutorials)
- [Keras 공식 문서](https://keras.io/)
- [Google Colab](https://colab.research.google.com/) - 무료 GPU 사용 가능
