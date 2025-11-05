# Recursos do App Mobile

## Ícones e Splash Screens

Para gerar os ícones e splash screens para Android e iOS, você precisará:

### 1. Criar o ícone principal (icon.png)
- Tamanho: **1024x1024 pixels**
- Formato: PNG com fundo transparente ou sólido
- Conteúdo: Logo da Locaservi centralizado

### 2. Criar a splash screen (splash.png)
- Tamanho: **2732x2732 pixels**
- Formato: PNG
- Conteúdo: Logo da Locaservi centralizado com fundo branco ou da cor da marca

### 3. Gerar os recursos nativos

Após adicionar os arquivos `icon.png` e `splash.png` nesta pasta, execute:

```bash
npm install @capacitor/assets --save-dev
npx capacitor-assets generate
```

Isso irá gerar automaticamente todos os tamanhos de ícones e splash screens necessários para Android e iOS.

## Cores da Marca Locaservi

Configure as cores principais no `capacitor.config.ts`:
- Background: `#ffffff` (ou cor da marca)
- Status Bar: `#1a1a1a` (ajustar conforme tema)

## Referências

- [Capacitor Assets Documentation](https://github.com/ionic-team/capacitor-assets)
- [Icon Guidelines](https://capacitorjs.com/docs/guides/splash-screens-and-icons)
