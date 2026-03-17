---
layout: post
title: "머신러닝 개발 환경 설정: Anaconda와 Jupyter Notebook"
date: 2025-10-22 09:05:00 +0900
categories: [knowledge, ai]
tags: [anaconda, jupyter-notebook, tensorflow, python, ml-environment]
description: "Anaconda와 Jupyter Notebook을 이용한 머신러닝 개발 환경 구축 방법과 TensorFlow 예제를 소개합니다."
image: /assets/images/posts/thumbnails/2025-12-28-ml-dev-environment.png
redirect_from:
  - "/knowledge/ai/2025/12/28/ml-dev-environment.html"
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

---

## PyTorch vs TensorFlow 비교

머신러닝 프레임워크 선택은 프로젝트 특성에 따라 달라집니다. 두 프레임워크의 주요 차이점을 비교합니다.

| 항목 | TensorFlow | PyTorch |
|------|-----------|---------|
| 개발사 | Google | Meta (Facebook) |
| 실행 방식 | 그래프 기반 (Eager mode 지원) | 동적 그래프 (기본) |
| 디버깅 | TF 2.0부터 개선됨 | Python 디버거 직접 사용 가능 |
| 배포 | TensorFlow Serving, TFLite, TF.js | TorchServe, ONNX |
| 커뮤니티 | 산업계 강세 | 연구/학계 강세 |
| 학습 곡선 | 중간 | 비교적 낮음 |

### PyTorch 기본 예제

```python
import torch
import torch.nn as nn
import torch.optim as optim

# 샘플 데이터
X = torch.tensor([[1.0], [2.0], [3.0], [4.0], [5.0]])
y = torch.tensor([[2.0], [4.0], [6.0], [8.0], [10.0]])

# 모델 정의
model = nn.Sequential(
    nn.Linear(1, 1)
)

# 손실 함수와 옵티마이저
criterion = nn.MSELoss()
optimizer = optim.SGD(model.parameters(), lr=0.01)

# 학습
for epoch in range(500):
    outputs = model(X)
    loss = criterion(outputs, y)

    optimizer.zero_grad()
    loss.backward()
    optimizer.step()

# 예측
with torch.no_grad():
    prediction = model(torch.tensor([[6.0]]))
    print(f"Prediction: {prediction.item():.2f}")  # 약 12에 가까운 값
```

---

## Jupyter Lab vs Jupyter Notebook

Jupyter Lab은 Jupyter Notebook의 차세대 버전으로, 더 풍부한 기능을 제공합니다.

| 기능 | Jupyter Notebook | Jupyter Lab |
|------|-----------------|-------------|
| 인터페이스 | 단일 문서 | 멀티 탭, 분할 화면 |
| 파일 탐색기 | 기본적 | 고급 (드래그앤드롭) |
| 터미널 | 미지원 | 내장 터미널 지원 |
| 확장 프로그램 | nbextensions | JupyterLab extensions |
| 마크다운 미리보기 | 셀 내에서만 | 별도 패널로 실시간 미리보기 |

```bash
# Jupyter Lab 설치 및 실행
pip install jupyterlab
jupyter lab
```

새 프로젝트를 시작한다면 Jupyter Lab을 사용하는 것을 권장합니다. 멀티 탭으로 여러 노트북을 동시에 작업할 수 있고, 내장 터미널에서 패키지 설치 등의 작업도 가능합니다.

---

## 가상환경 관리: Conda vs venv vs Poetry

### Conda

데이터 사이언스 프로젝트에서 가장 많이 사용됩니다. Python뿐만 아니라 C/C++ 라이브러리(CUDA, cuDNN 등)도 함께 관리할 수 있습니다.

```bash
# 환경 생성 및 패키지 설치
conda create -n ml-project python=3.10
conda activate ml-project
conda install pytorch torchvision -c pytorch

# 환경 내보내기 (재현 가능)
conda env export > environment.yml

# 환경 복원
conda env create -f environment.yml
```

### venv + pip

Python 내장 가상환경입니다. 간단한 프로젝트에 적합합니다.

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 선택 가이드

| 상황 | 추천 도구 |
|------|----------|
| ML/DL 프로젝트 (GPU 사용) | Conda |
| 간단한 스크립트 | venv + pip |
| 팀 프로젝트 (의존성 잠금 필요) | Poetry 또는 Conda |
| Docker 컨테이너 내 | venv + pip (이미지 크기 최소화) |

---

## Google Colab 활용 팁

Google Colab은 무료 GPU/TPU를 제공하는 클라우드 기반 Jupyter 환경입니다. 로컬에 GPU가 없어도 딥러닝 실험을 할 수 있습니다.

### GPU 런타임 설정

1. 메뉴에서 **런타임 > 런타임 유형 변경** 선택
2. **하드웨어 가속기**에서 GPU 또는 TPU 선택
3. 저장 클릭

### GPU 확인

```python
import torch

# GPU 사용 가능 여부 확인
print(f"CUDA available: {torch.cuda.is_available()}")
print(f"GPU: {torch.cuda.get_device_name(0)}")
```

### Colab 제한사항

- 무료 티어: 세션 최대 12시간, GPU 사용 제한
- Pro 티어: 더 긴 세션, 더 빠른 GPU, 더 많은 메모리
- 대용량 데이터는 Google Drive를 마운트하여 사용

```python
# Google Drive 마운트
from google.colab import drive
drive.mount('/content/drive')
```

---

## MLflow로 실험 관리

머신러닝 프로젝트에서는 다양한 하이퍼파라미터와 모델을 실험하게 됩니다. MLflow를 사용하면 실험을 체계적으로 관리할 수 있습니다.

```python
import mlflow

# 실험 시작
mlflow.set_experiment("my-ml-experiment")

with mlflow.start_run():
    # 하이퍼파라미터 기록
    mlflow.log_param("learning_rate", 0.01)
    mlflow.log_param("epochs", 100)
    mlflow.log_param("batch_size", 32)

    # 학습 진행...

    # 메트릭 기록
    mlflow.log_metric("accuracy", 0.95)
    mlflow.log_metric("loss", 0.05)

    # 모델 저장
    mlflow.sklearn.log_model(model, "model")
```

```bash
# MLflow UI 실행
mlflow ui
# http://localhost:5000 에서 실험 결과 확인
```

MLflow를 사용하면 어떤 파라미터 조합이 가장 좋은 성능을 냈는지 쉽게 비교할 수 있습니다.

---

## 추가 리소스

- [TensorFlow 공식 튜토리얼](https://www.tensorflow.org/tutorials)
- [Keras 공식 문서](https://keras.io/)
- [Google Colab](https://colab.research.google.com/) - 무료 GPU 사용 가능
- [PyTorch 공식 튜토리얼](https://pytorch.org/tutorials/)
- [MLflow 공식 문서](https://mlflow.org/docs/latest/index.html)
- [Kaggle](https://www.kaggle.com/) - 데이터셋과 경진대회
