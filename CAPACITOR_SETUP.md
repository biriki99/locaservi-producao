# 📱 Guia Completo: Transformação em App Nativo com Capacitor

## ✅ Etapa 1: Configuração Inicial (CONCLUÍDA)

As seguintes dependências foram instaladas:
- ✅ `@capacitor/core`
- ✅ `@capacitor/cli`
- ✅ `@capacitor/android`
- ✅ `@capacitor/ios`
- ✅ `@capacitor/status-bar`
- ✅ `@capacitor/splash-screen`

Arquivos criados:
- ✅ `capacitor.config.ts` - Configuração principal do Capacitor
- ✅ `vite.config.ts` - Ajustado para build otimizado
- ✅ `resources/` - Pasta para ícones e splash screens

---

## 📋 Próximos Passos (Executar Localmente)

### 1️⃣ Exportar o projeto para GitHub
Clique em **"Export to Github"** no Lovable e faça `git pull` do projeto na sua máquina local.

### 2️⃣ Instalar dependências
```bash
npm install
```

### 3️⃣ Adicionar ícones e splash screens
Substitua os arquivos placeholder em `resources/`:
- `resources/icon.png` - 1024x1024px (logo da Locaservi)
- `resources/splash.png` - 2732x2732px (splash screen)

Depois execute:
```bash
npm install @capacitor/assets --save-dev
npx capacitor-assets generate
```

### 4️⃣ Inicializar Capacitor
```bash
npx cap init
```

Confirme os valores:
- **App ID:** `com.locaservi.gestao`
- **App Name:** `Locaservi - Sistema de Gestão`
- **Web Dir:** `dist`

### 5️⃣ Build do projeto
```bash
npm run build
```

### 6️⃣ Adicionar plataformas nativas

#### Para Android:
```bash
npx cap add android
npx cap sync android
npx cap open android
```

#### Para iOS (requer macOS):
```bash
npx cap add ios
npx cap sync ios
npx cap open ios
```

---

## 🔧 Configurações Nativas Necessárias

### Android (android/app/src/main/AndroidManifest.xml)

Adicionar permissões:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

### iOS (ios/App/App/Info.plist)

Adicionar configurações de segurança:
```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

---

## 🚀 Build para Produção

### Android - Gerar APK/AAB assinado:

1. Gerar keystore:
```bash
keytool -genkey -v -keystore locaservi-release.keystore -alias locaservi -keyalg RSA -keysize 2048 -validity 10000
```

2. Configurar em `android/app/build.gradle`:
```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('../../locaservi-release.keystore')
            storePassword 'SUA_SENHA'
            keyAlias 'locaservi'
            keyPassword 'SUA_SENHA'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

3. Gerar bundle:
```bash
cd android
./gradlew bundleRelease
```

O arquivo `.aab` estará em: `android/app/build/outputs/bundle/release/app-release.aab`

### iOS - Build para App Store:

1. Abra o projeto no Xcode:
```bash
npx cap open ios
```

2. Configure:
   - **Signing & Capabilities** → Selecione seu Apple Developer Team
   - **Bundle Identifier:** `com.locaservi.gestao`
   - **Version:** Configure versão e build number

3. Build:
   - **Product → Archive**
   - **Distribute App → App Store Connect**

---

## 🔄 Comandos Úteis

```bash
# Sincronizar código web com apps nativos
npx cap sync

# Sincronizar apenas Android
npx cap sync android

# Sincronizar apenas iOS
npx cap sync ios

# Executar app no Android
npx cap run android

# Executar app no iOS
npx cap run ios

# Atualizar plugins do Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios

# Rebuild completo
npm run build && npx cap sync
```

---

## 📝 Scripts NPM Recomendados

Adicione ao `package.json` (manualmente):

```json
{
  "scripts": {
    "build:mobile": "npm run build && npx cap sync",
    "android": "npx cap run android",
    "ios": "npx cap run ios",
    "sync": "npx cap sync",
    "open:android": "npx cap open android",
    "open:ios": "npx cap open ios"
  }
}
```

---

## 📱 Publicação nas Lojas

### Google Play Console (Android)
1. Criar conta de desenvolvedor: https://play.google.com/console
2. Taxa única: $25 USD
3. Upload do arquivo `.aab`
4. Preencher ficha da loja (descrição, screenshots, ícone)
5. Enviar para revisão

### App Store Connect (iOS)
1. Criar conta Apple Developer: https://developer.apple.com
2. Taxa anual: $99 USD
3. Upload via Xcode ou Transporter
4. Preencher metadata da app
5. Enviar para revisão

---

## ⚠️ Considerações Importantes

### 1. Ambiente de Produção
O Capacitor está configurado para usar o build local (`webDir: 'dist'`).
Se preferir apontar para o servidor em produção, altere em `capacitor.config.ts`:
```typescript
server: {
  url: 'https://www.fabiolorenzetti.com.br',
  cleartext: true
}
```
⚠️ **Nota:** Não recomendado para produção! Apps devem usar código local para melhor performance e funcionamento offline.

### 2. Supabase Authentication
Certifique-se de adicionar os deep links corretos no Supabase:
- Android: `com.locaservi.gestao://`
- iOS: `com.locaservi.gestao://`

### 3. Atualizações
Toda vez que fizer mudanças no código web:
```bash
npm run build
npx cap sync
```

---

## 🎯 Checklist de Publicação

- [ ] Ícones e splash screens criados (1024x1024 e 2732x2732)
- [ ] Build de produção testado (`npm run build`)
- [ ] App testado em dispositivo Android físico
- [ ] App testado em dispositivo iOS físico (se aplicável)
- [ ] Keystore gerada e guardada em local seguro (Android)
- [ ] Bundle `.aab` gerado e assinado (Android)
- [ ] Archive criado no Xcode (iOS)
- [ ] Screenshots preparados para as lojas (vários tamanhos)
- [ ] Descrição e textos da ficha da loja prontos
- [ ] Política de privacidade publicada online
- [ ] Termos de uso disponíveis

---

## 📚 Documentação Oficial

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Publishing Guide](https://developer.android.com/studio/publish)
- [iOS Publishing Guide](https://developer.apple.com/ios/submit/)
- [Capacitor + Supabase](https://supabase.com/docs/guides/getting-started/tutorials/with-ionic-react)

---

## 🆘 Suporte

Se encontrar problemas:
1. Verifique os logs: `npx cap sync --verbose`
2. Limpe o cache: `rm -rf node_modules dist android ios && npm install`
3. Consulte a documentação do Capacitor
4. Verifique issues no GitHub do Capacitor

---

**✨ Projeto configurado e pronto para transformação em app nativo!**
