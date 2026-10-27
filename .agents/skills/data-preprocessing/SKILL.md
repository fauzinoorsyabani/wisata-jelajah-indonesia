---
name: data-preprocessing
description: >
  Skill untuk praproses data gempa bumi Indonesia. Digunakan saat membuat
  notebook 01_praproses.ipynb. Mencakup handling missing values, encoding,
  normalisasi, outlier detection, dan feature engineering khusus data seismik.
---

# Skill: Data Preprocessing — Gempa Bumi Indonesia

## Tujuan
Mempersiapkan dataset gempa bumi mentah (`earthquakes_indonesia.csv`) menjadi
dataset bersih dan siap digunakan untuk EDA dan pemodelan ML.

## Langkah Wajib (Berurutan)

### 1. Load & Inspeksi Awal
```python
import pandas as pd
import numpy as np

df = pd.read_csv('data/raw/earthquakes_indonesia.csv')
print(f"Shape: {df.shape}")
print(df.dtypes)
print(df.isnull().sum())
df.head()
```

### 2. Konversi Tipe Data
```python
df['date'] = pd.to_datetime(df['date'])
df['magnitude'] = pd.to_numeric(df['magnitude'], errors='coerce')
df['depth']     = pd.to_numeric(df['depth'], errors='coerce')
df['latitude']  = pd.to_numeric(df['latitude'], errors='coerce')
df['longitude'] = pd.to_numeric(df['longitude'], errors='coerce')
```

### 3. Handling Missing Values
```python
# Kolom numerik → isi dengan median
for col in ['magnitude', 'depth', 'latitude', 'longitude']:
    df[col].fillna(df[col].median(), inplace=True)

# Kolom kategorik → isi dengan modus atau 'Unknown'
df['province'].fillna('Unknown', inplace=True)
df['tsunami'].fillna(0, inplace=True)
```

### 4. Duplikat
```python
n_dup = df.duplicated().sum()
print(f"Duplikat ditemukan: {n_dup}")
df.drop_duplicates(inplace=True)
df.reset_index(drop=True, inplace=True)
```

### 5. Outlier Detection (IQR)
```python
def remove_outlier_iqr(df, col):
    Q1  = df[col].quantile(0.25)
    Q3  = df[col].quantile(0.75)
    IQR = Q3 - Q1
    lower, upper = Q1 - 1.5*IQR, Q3 + 1.5*IQR
    before = len(df)
    df = df[(df[col] >= lower) & (df[col] <= upper)]
    print(f"{col}: {before - len(df)} outlier dihapus")
    return df

# Hanya hapus outlier depth yang tidak masuk akal (>700km)
df = df[df['depth'] <= 700]
df = df[df['magnitude'] >= 1.0]
```

### 6. Feature Engineering
```python
# Tingkat risiko berdasarkan magnitudo (target variable)
def klasifikasi_risiko(mag):
    if mag < 4.0:   return 'Rendah'
    elif mag < 5.0: return 'Sedang'
    elif mag < 6.0: return 'Tinggi'
    else:           return 'Sangat Tinggi'

df['risk_level'] = df['magnitude'].apply(klasifikasi_risiko)

# Kategori kedalaman
def kategori_kedalaman(depth):
    if depth < 70:    return 'Dangkal'
    elif depth < 300: return 'Menengah'
    else:             return 'Dalam'

df['depth_category'] = df['depth'].apply(kategori_kedalaman)

# Fitur temporal
df['year']        = df['date'].dt.year
df['month']       = df['date'].dt.month
df['day_of_week'] = df['date'].dt.dayofweek
df['quarter']     = df['date'].dt.quarter
```

### 7. Encoding & Scaling
```python
from sklearn.preprocessing import LabelEncoder, StandardScaler
import joblib

# Label encode target
le = LabelEncoder()
df['risk_level_enc'] = le.fit_transform(df['risk_level'])
joblib.dump(le, 'models/label_encoder.pkl')

# Label encode kategorik
df['depth_category_enc'] = LabelEncoder().fit_transform(df['depth_category'])

# Simpan cleaned
df.to_csv('data/processed/earthquakes_cleaned.csv', index=False)

# Feature set untuk modeling
FEATURES = ['latitude', 'longitude', 'depth', 'year', 'month', 
            'day_of_week', 'quarter', 'depth_category_enc', 'tsunami']
TARGET   = 'risk_level_enc'

df_feat = df[FEATURES + [TARGET, 'risk_level']].copy()
df_feat.to_csv('data/processed/earthquakes_features.csv', index=False)
```

## Output yang Dihasilkan
- `data/processed/earthquakes_cleaned.csv` — data bersih
- `data/processed/earthquakes_features.csv` — fitur siap model
- `models/label_encoder.pkl` — encoder target
