import numpy as np
from scipy.integrate import quad

# Definisikan fungsi yang membatasi bentuk benda putar
def f(x):
    return x**2  # Contoh fungsi f(x) = x^2

def g(x):
    return x  # Contoh fungsi g(x) = x

# Batas integrasi
a = 0  # Batas bawah
b = 2  # Batas atas

# Fungsi untuk menghitung volume menggunakan metode cincin
def volume(f, g, a, b):
    # Fungsi integran (f(x)^2 - g(x)^2)
    integrand = lambda x: np.pi * (f(x)**2 - g(x)**2)
    
    # Menghitung integral dari fungsi
    volume, error = quad(integrand, a, b)
    
    return volume

# Menampilkan soal terlebih dahulu
print("Soal:")
print(f"Menghitung volume benda putar yang dibatasi oleh fungsi f(x) = x^2 dan g(x) = x pada interval [{a}, {b}]")
print("Dengan menggunakan metode cincin (disk method), volume dihitung dengan rumus:")
print("V = π ∫[a, b] (f(x)^2 - g(x)^2) dx")

# Menanyakan apakah pengguna ingin melanjutkan perhitungan
input("\nTekan Enter untuk menghitung volume...")

# Menghitung volume
vol = volume(f, g, a, b)

# Menampilkan jawaban
print("\nJawaban:")
print(f"Volume benda putar adalah: {vol:.4f}")
