# Match Analyst - Guida Completa

## 📹 Overview

Il **Match Analyst** è uno strumento per analizzare le tue partite caricando video e tracciando in tempo reale gli eventi che accadono. Genera automaticamente statistiche complete per ogni giocatore e per la squadra.

---

## 🚀 Quick Start

### Step 1: Upload Video
1. Naviga a **Match Analyst** dal sidebar
2. Seleziona la partita dall'elenco
3. Carica il video (drag-drop o seleziona file)
4. Formati supportati: MP4, WebM, MOV (max 500MB)

### Step 2: Tracker Eventi
1. Vai al tab **"Tracker"**
2. Usa il video player per navigare (play/pause, velocità, volume)
3. Quando accade un'azione:
   - Seleziona il tipo di evento (tiro, passaggio, etc)
   - Scegli il giocatore che ha fatto l'azione
   - Aggiungi dettagli extra se richiesti
   - Clicca "Aggiungi Evento"
4. Continua per tutta la durata del video

### Step 3: Visualizza Statistiche
1. Vai al tab **"Statistiche"**
2. Vedi i grafici con:
   - Confronto statistiche squadre
   - Possesso palla
   - Timeline degli eventi
   - Top performer della partita
3. Esporta in JSON per salvare i dati

---

## 📊 Tipi di Eventi Tracciabili

### 🔵 Passaggio
- Seleziona dal dropdown "Passaggio"
- Marca se completato o sbagliato
- Viene contato nella precisione passaggi (%)

### 🎯 Tiro
- Seleziona il tipo di precisione:
  - **Nello specchio** (on target)
  - **Alto** (sopra la traversa)
  - **Largo** (fuori dallo specchio)
  - **Bloccato** (murato)
  - **Gol**
- Influenza il rating del giocatore

### ⚽ Gol
- Evento speciale che incrementa il totale gol
- Assegnato al giocatore che ha segnato
- Boost importante nel rating finale

### 🛡️ Intercetto
- Quando un giocatore intercetta un passaggio avversario
- Conta come azione difensiva positiva
- Aggiunge punti al rating

### 🚷 Tackle
- Quando un giocatore fa un tackle
- Non importa se riuscito o fallito
- Conta nella categoria "Azioni Difensive"

### 🏃 Dribbling
- Quando un giocatore dribbla l'avversario
- Marca se riuscito o no
- Importante per valutare la creatività

### 🟨 Fallo
- Quando un giocatore commette un fallo
- Penalizza il rating del giocatore
- Conteggio totale falli

### 🥅 Parata
- Solo per il portiere
- Quando effettua una parata
- Boost importante nel rating del portiere

### ⬆️ Colpo di Testa
- Quando un giocatore colpisce di testa
- Utile per analizzare il gioco aereo

---

## 📈 Statistiche Calcolate Automaticamente

### Per Giocatore
- **Tiri**: Numero totale di tiri
- **Tiri nello Specchio**: Tiri che vanno verso il portiere
- **Precisione Tiri**: % di tiri nello specchio
- **Gol**: Numero di gol segnati
- **Passaggi**: Numero totale di passaggi
- **Passaggi Completati**: Passaggi riusciti
- **Precisione Passaggi**: % di passaggi completati
- **Intercetti**: Numero di intercetti
- **Tackle**: Numero di tackle
- **Dribbling**: Numero di dribbling completati
- **Falli**: Numero di falli commessi
- **Parate**: Solo per portiere
- **Rating (1-10)**: Valutazione complessiva basata su tutti gli eventi

### Per Squadra
- **Tiri**: Totale tiri della squadra
- **Gol**: Totale gol della squadra
- **Passaggi**: Totale passaggi
- **Precisione Passaggi**: Media precisione passaggi
- **Possesso Palla**: % calcolata dagli eventi
- **Intercetti**: Totale intercetti difensivi
- **Tackle**: Totale tackle difensivi
- **Falli**: Totale falli commessi

### Timeline
- **Raggruppamento**: Ogni 5 minuti
- **Metriche**: Gol, tiri, passaggi completati
- Utile per analizzare gli andamenti della partita

### Top Performer
- Classifica giocatori per rating
- Mostra i 5 migliori con dettagli
- Include emoji di medaglia (🥇 🥈 🥉)

---

## 🎮 Controlli Video Player

| Controllo | Funzione |
|-----------|----------|
| **Play/Pause** | Avvia/metti in pausa il video |
| **Timeline** | Trascinare per cambiare minuto (mouse/touch) |
| **Velocità** | 0.5x, 1x, 1.5x, 2x (slow-mo o veloce) |
| **Volume** | Slider per regolare il volume |
| **Marca Evento** | Button per segnare un'azione al minuto corrente |

### Keyboard Shortcuts (Prossimamente)
- **Spacebar**: Play/Pause
- **←/→**: Indietro/Avanti 5 secondi
- **↑/↓**: Aumenta/Riduci volume

---

## 💾 Export e Salva

### Download JSON
1. Una volta tracciati gli eventi, vai a **"Statistiche"**
2. Clicca il bottone **"Esporta JSON"**
3. Si scaricherà un file con tutti i dati:
   ```json
   {
     "match_id": "m1",
     "total_events": 145,
     "events": [...],
     "exported_at": "2026-05-16T10:00:00Z"
   }
   ```

### Salva su Database
- I dati vengono salvati automaticamente durante il tracking
- Accessibili dalla pagina successiva
- Sincronizzazione con team (prossimamente)

---

## 🧠 Formula Rating Giocatore

Il rating viene calcolato per ogni giocatore in scala 1-10:

```
Base: 5.0
+ 30 punti per Gol
+ 5 punti per Tiro nello Specchio
+ 1 punto per Tiro fuori specchio
+ 2 punti per Passaggio Completato
- 1 punto per Passaggio Sbagliato
+ 5 punti per Intercetto
+ 4 punti per Tackle
+ 3 punti per Dribbling Riuscito
+ 1 punto per Dribbling Fallito
- 2 punti per Fallo
+ 8 punti per Parata (portiere)

Rating Finale = Base + (Punti Totali / Numero Eventi)
Scala: 1-10
```

**Esempio**:
- Giocatore con 8 tiri nello specchio, 2 gol, 45 passaggi completati (50 totali), 3 intercetti, 1 fallo
- Punti: (2×30) + (8×5) + (45×2) + (3×5) + (-1×2) = 60 + 40 + 90 + 15 - 2 = 203
- Rating: 5 + (203 / 59 eventi) = 5 + 3.4 = **8.4/10** ⭐

---

## ⚙️ Impostazioni

### Preferenze Video
- Mantieni la velocità di riproduzione preferita
- Volume predefinito salvato localmente

### Esporta Dati
- Formato JSON (default)
- CSV (prossimamente)
- Integrazione Supabase (prossimamente)

---

## 🐛 Troubleshooting

### Il video non si carica
- ✅ Verifica il formato (MP4, WebM, MOV)
- ✅ Verifica la dimensione (max 500MB)
- ✅ Prova a ricaricare la pagina

### Gli eventi non si salvano
- ✅ Assicurati di completare tutti i campi richiesti
- ✅ Controlla la connessione internet
- ✅ Prova a esportare in JSON per salvare

### Il rating è troppo basso/alto
- ✅ Rivedi il calcolo: formula basata su tutti gli eventi
- ✅ Aggiungi altri eventi positivi (passaggi completati, intercetti)
- ✅ Riduci i falli commessi

---

## 🔮 Funzioni Future (Roadmap)

- [ ] **AI Video Analysis**: Riconoscimento automatico degli eventi dal video (ML model)
- [ ] **Heatmaps**: Visualizza dove i giocatori passano più tempo
- [ ] **Pass Networks**: Grafo dei passaggi tra giocatori
- [ ] **Expected Goals (xG)**: Metrica avanzata di qualità tiri
- [ ] **Comparazione Partite**: Analytics storiche tra partite
- [ ] **Sincronizzazione Live**: Tracker in tempo reale durante la partita
- [ ] **Mobile App**: App dedicata per tablet/smartphone
- [ ] **Live Stream Integration**: Caricamento diretto da Twitch/YouTube
- [ ] **Team Comparison**: Vs database di altre squadre

---

## 📚 Best Practices

1. **Sii coerente**: Usa la stessa terminologia ogni volta
2. **Dettagli importanti**: Aggiungi note sui circostanze (es: "Fallo di mano in area")
3. **Velocità moderata**: Usa velocità 0.5x-1x per non perdere eventi
4. **Rivedi**: Dopo il video, revisionalo 1x per verificare i dati
5. **Esporta regolarmente**: Salva i dati dopo ogni analisi
6. **Backup**: Mantieni copie dei JSON sul cloud

---

**Versione**: 1.0  
**Ultimo Update**: 16 Maggio 2026  
**Supporto**: Contatta il team captain per problemi
