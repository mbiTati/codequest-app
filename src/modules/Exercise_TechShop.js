import { useState, useRef } from 'react';
import { useAuth } from '../lib/AuthProvider';
import { supabase } from '../lib/supabase';
import { ChevronLeft, ChevronRight, X, Upload, Check, Code, FileText, Bug, BookOpen, Zap, Play } from 'lucide-react';

const C = {
  bg:"#0a0f1a",card:"#111827",accent:"#32E0C4",gold:"#F59E0B",
  text:"#e2e8f0",muted:"#94a3b8",border:"#1e293b",danger:"#EF4444",
  primary:"#0D7377",success:"#10B981",dimmed:"#64748b",code:"#1E293B",codeTxt:"#67e8f9",
};

// ============================================
// SLIDES DE PRESENTATION (pas de technique !)
// ============================================
const SLIDES = [
  {
    title: "Bienvenue chez TechShop Geneve 🖥️",
    body: `<p style="font-size:14px;line-height:1.8">
      <strong>Sophie Martin</strong> gere un magasin d'informatique a Geneve depuis 5 ans.
      Elle vend des ordinateurs, des composants et des peripheriques.
      <br/><br/>
      Son magasin grandit : <strong>150 articles</strong> en stock, <strong>80 clients reguliers</strong>,
      et <strong>20 ventes par jour</strong>.
      <br/><br/>
      Jusqu'a maintenant, tout etait gere sur des feuilles Excel... mais ca ne suffit plus.
    </p>`,
  },
  {
    title: "Le probleme de Sophie 😰",
    body: `<div style="background:#EF444415;border:1px solid #EF444440;border-radius:8px;padding:12px;margin-bottom:12px">
      <p style="color:#EF4444;font-weight:700;margin-bottom:8px">Ce qui ne va pas :</p>
      <p style="font-size:13px;line-height:1.8">
        • Elle ne sait jamais combien d'articles il reste en stock<br/>
        • Elle perd la trace des commandes clients<br/>
        • Elle ne peut pas calculer son chiffre d'affaires facilement<br/>
        • Les erreurs de saisie sont frequentes (prix negatifs, stock a -5...)<br/>
        • Quand un client appelle, elle met 10 minutes a retrouver sa commande
      </p>
    </div>`,
  },
  {
    title: "Ce que Sophie veut 🎯",
    body: `<div style="background:#10B98115;border:1px solid #10B98140;border-radius:8px;padding:12px">
      <p style="color:#10B981;font-weight:700;margin-bottom:8px">Les besoins de Sophie :</p>
      <p style="font-size:13px;line-height:2">
        1. <strong>Gerer ses articles</strong> — nom, categorie, prix, quantite en stock<br/>
        2. <strong>Gerer ses clients</strong> — nom, prenom, email, telephone<br/>
        3. <strong>Enregistrer les ventes</strong> — quel client achete quel article, combien, a quel prix<br/>
        4. <strong>Calculer automatiquement</strong> — stock restant, total de la vente, chiffre d'affaires<br/>
        5. <strong>Rechercher rapidement</strong> — trouver un client, un article, une vente<br/>
        6. <strong>Eviter les erreurs</strong> — pas de prix negatif, pas de stock negatif, email valide
      </p>
    </div>`,
  },
  {
    title: "Les regles du magasin 📋",
    body: `<div style="background:#F59E0B15;border:1px solid #F59E0B40;border-radius:8px;padding:12px">
      <p style="color:#F59E0B;font-weight:700;margin-bottom:8px">Regles metier :</p>
      <p style="font-size:13px;line-height:2">
        • Chaque article a une <strong>categorie</strong> (Ordinateur, Composant, Peripherique, Accessoire)<br/>
        • Un client peut faire <strong>plusieurs achats</strong><br/>
        • Une vente concerne <strong>un seul client</strong> mais peut contenir <strong>plusieurs articles</strong><br/>
        • Le prix de vente peut etre <strong>different du prix catalogue</strong> (remise)<br/>
        • La remise maximale est de <strong>30%</strong><br/>
        • Le stock ne peut <strong>jamais etre negatif</strong><br/>
        • Chaque vente a une <strong>date</strong> automatique
      </p>
    </div>`,
  },
  {
    title: "Votre mission 🚀",
    body: `<p style="font-size:14px;line-height:1.8">
      Vous allez creer un <strong>programme Java complet</strong> pour Sophie en <strong>6 etapes</strong> :
    </p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px">
      <div style="background:#0D737715;border-radius:6px;padding:8px;font-size:12px"><strong>1. Algorithme</strong><br/>Flowchart du systeme</div>
      <div style="background:#14A3C715;border-radius:6px;padding:8px;font-size:12px"><strong>2. Classes UML</strong><br/>Diagramme de classes</div>
      <div style="background:#32E0C415;border-radius:6px;padding:8px;font-size:12px"><strong>3. Pseudo-code</strong><br/>Logique avant le Java</div>
      <div style="background:#F59E0B15;border-radius:6px;padding:8px;font-size:12px"><strong>4. Code Java</strong><br/>Classes + constructeurs</div>
      <div style="background:#7C3AED15;border-radius:6px;padding:8px;font-size:12px"><strong>5. Execution</strong><br/>Tester + corriger</div>
      <div style="background:#EF444415;border-radius:6px;padding:8px;font-size:12px"><strong>6. Tests + Doc</strong><br/>Debugging + Javadoc</div>
    </div>`,
  },
  {
    title: "A vous de jouer ! 💡",
    body: `<p style="font-size:14px;line-height:1.8">
      Avant de commencer, reflechissez :
    </p>
    <div style="background:#0a0f1a;border:1px solid #1e293b;border-radius:8px;padding:12px;margin-top:8px">
      <p style="font-size:13px;line-height:2;color:#67e8f9">
        ❓ Combien de <strong>classes</strong> Java faut-il creer ?<br/>
        ❓ Quels <strong>attributs</strong> pour chaque classe ?<br/>
        ❓ Quelles <strong>methodes</strong> sont necessaires ?<br/>
        ❓ Comment <strong>valider</strong> les donnees (pas de prix negatif) ?<br/>
        ❓ Comment <strong>lier</strong> un client a ses ventes ?<br/>
        ❓ Comment <strong>calculer</strong> le total d'une vente ?
      </p>
    </div>
    <p style="font-size:12px;color:#94a3b8;margin-top:12px">
      Fermez cette presentation et commencez l'etape 1. Bonne chance ! 🎯
    </p>`,
  },
];

// ============================================
// 6 ETAPES DU PROJET
// ============================================
const STEPS = [
  {
    name: "Algorithme (Flowchart)",
    icon: "📋",
    lo: "LO1",
    type: "upload",
    accept: ".pdf,.png,.jpg,.docx",
    xp: 15,
    instructions: `<strong>Objectif :</strong> Dessiner le flowchart du systeme TechShop.
    <br/><br/>
    <strong>Ce qu'il faut faire :</strong>
    <br/>• Identifier les <strong>actions principales</strong> du programme (ajouter article, enregistrer vente, calculer total...)
    <br/>• Dessiner un flowchart avec les <strong>symboles standard</strong> (debut/fin, processus, decision, entree/sortie)
    <br/>• Montrer le <strong>flux de donnees</strong> entre les actions
    <br/><br/>
    <strong>Livrable :</strong> Un flowchart (dessine a la main ou avec un outil) en PDF, PNG ou DOCX.
    <br/><br/>
    <strong>Conseil :</strong> Commencez par le scenario "un client achete un article" — c'est le coeur du systeme.`,
  },
  {
    name: "Diagramme de classes (UML)",
    icon: "🔷",
    lo: "LO1/LO2",
    type: "upload",
    accept: ".pdf,.png,.jpg,.docx",
    xp: 20,
    instructions: `<strong>Objectif :</strong> Identifier les classes Java necessaires et leurs relations.
    <br/><br/>
    <strong>Ce qu'il faut faire :</strong>
    <br/>• Identifier les <strong>classes</strong> (quels "objets" dans le magasin ?)
    <br/>• Pour chaque classe : lister les <strong>attributs</strong> (nom, type) et les <strong>methodes</strong>
    <br/>• Dessiner les <strong>relations</strong> entre les classes (association, composition)
    <br/>• Indiquer les <strong>cardinalites</strong> (1..*, 0..1, etc.)
    <br/><br/>
    <strong>Notation UML :</strong>
    <br/><code>+ public  - private  # protected</code>
    <br/><code>NomClasse { -attribut: Type; +methode(): ReturnType }</code>
    <br/><br/>
    <strong>Livrable :</strong> Un diagramme de classes UML en PDF, PNG ou DOCX.`,
  },
  {
    name: "Pseudo-code",
    icon: "📝",
    lo: "LO1",
    type: "text",
    xp: 15,
    instructions: `<strong>Objectif :</strong> Ecrire la logique du programme AVANT de coder en Java.
    <br/><br/>
    <strong>Ce qu'il faut faire :</strong>
    <br/>• Ecrire en pseudo-code le scenario principal : <strong>"Enregistrer une vente"</strong>
    <br/>• Inclure : la validation des donnees, le calcul du total, la mise a jour du stock
    <br/><br/>
    <strong>Exemple de pseudo-code :</strong>
    <br/><code>FONCTION enregistrerVente(client, listeArticles)</code>
    <br/><code>&nbsp;&nbsp;POUR CHAQUE article DANS listeArticles</code>
    <br/><code>&nbsp;&nbsp;&nbsp;&nbsp;SI article.stock > 0 ALORS</code>
    <br/><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;diminuerStock(article, 1)</code>
    <br/><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;total = total + article.prix</code>
    <br/><code>&nbsp;&nbsp;&nbsp;&nbsp;SINON</code>
    <br/><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AFFICHER "Stock insuffisant"</code>
    <br/><code>&nbsp;&nbsp;FIN POUR</code>
    <br/><code>&nbsp;&nbsp;RETOURNER total</code>
    <br/><code>FIN FONCTION</code>
    <br/><br/>
    <strong>Livrable :</strong> Le pseudo-code complet dans la zone de texte ci-dessous.`,
  },
  {
    name: "Code Java — Classes",
    icon: "☕",
    lo: "LO3",
    type: "java",
    xp: 30,
    instructions: `<strong>Objectif :</strong> Ecrire les classes Java dans l'editeur OneCompiler.
    <br/><br/>
    <strong>Ce qu'il faut faire :</strong>
    <br/>• Creer les classes identifiees dans le diagramme UML
    <br/>• Chaque classe doit avoir : <strong>attributs prives</strong>, <strong>constructeur</strong>, <strong>getters/setters</strong>
    <br/>• Ajouter la <strong>validation</strong> (pas de prix negatif, stock >= 0)
    <br/>• Creer une classe <strong>Main</strong> qui teste le systeme
    <br/><br/>
    <strong>Criteres d'evaluation :</strong>
    <br/>✅ Encapsulation (attributs private + getters/setters)
    <br/>✅ Constructeur avec parametres
    <br/>✅ Validation des donnees (try-catch ou if)
    <br/>✅ Methode toString() pour l'affichage
    <br/>✅ Le code compile et s'execute sans erreur
    <br/><br/>
    <strong>Ouvrez OneCompiler ci-dessous et codez !</strong>`,
    starterCode: `// TechShop Geneve — Votre code Java ici
// Creez les classes : Article, Client, Vente, TechShop

class Article {
    // TODO: attributs prives (nom, categorie, prix, stock)
    // TODO: constructeur
    // TODO: getters/setters avec validation
    // TODO: toString()
}

class Client {
    // TODO: attributs prives (nom, prenom, email, telephone)
    // TODO: constructeur
    // TODO: getters/setters
    // TODO: toString()
}

// TODO: class Vente { ... }
// TODO: class TechShop { ... }

public class Main {
    public static void main(String[] args) {
        System.out.println("=== TechShop Geneve ===");
        // TODO: creer des articles, des clients, des ventes
        // TODO: tester les methodes
    }
}`,
  },
  {
    name: "Execution + Correction",
    icon: "▶️",
    lo: "LO3",
    type: "java",
    xp: 25,
    instructions: `<strong>Objectif :</strong> Tester votre programme avec des donnees reelles et corriger les bugs.
    <br/><br/>
    <strong>Ce qu'il faut faire :</strong>
    <br/>• Creer au moins <strong>5 articles</strong> (avec des noms suisses !)
    <br/>• Creer au moins <strong>3 clients</strong>
    <br/>• Enregistrer au moins <strong>2 ventes</strong>
    <br/>• Tester les <strong>cas limites</strong> : prix negatif, stock a 0, remise > 30%
    <br/>• Afficher le <strong>chiffre d'affaires total</strong>
    <br/>• Afficher le <strong>stock restant</strong> de chaque article
    <br/><br/>
    <strong>Donnees de test :</strong>
    <br/>Articles : MacBook Pro (2499 CHF), Clavier Logitech (89 CHF), Ecran Samsung 27" (449 CHF), Souris Razer (79 CHF), SSD Samsung 1TB (129 CHF)
    <br/>Clients : Sophie Martin, Jean Dupont, Marie Rossi
    <br/><br/>
    <strong>Criteres :</strong>
    <br/>✅ Le programme s'execute sans erreur
    <br/>✅ Les validations fonctionnent (rejet des valeurs invalides)
    <br/>✅ Les calculs sont corrects (total vente, stock mis a jour)`,
    starterCode: `// Collez votre code complet ici et ajoutez les tests

public class Main {
    public static void main(String[] args) {
        System.out.println("=== TechShop Geneve — Tests ===");
        
        // Creer les articles
        // Article a1 = new Article("MacBook Pro", "Ordinateur", 2499.0, 10);
        
        // Creer les clients
        // Client c1 = new Client("Martin", "Sophie", "sophie@email.ch", "022 123 45 67");
        
        // Tester une vente
        // Vente v1 = new Vente(c1);
        // v1.ajouterArticle(a1, 1);
        
        // Tester les cas limites
        // Article invalide = new Article("Test", "X", -10, -5); // DOIT echouer !
        
        // Afficher le CA total
        // System.out.println("CA total : " + techshop.getChiffreAffaires() + " CHF");
    }
}`,
  },
  {
    name: "Tests + Documentation",
    icon: "📄",
    lo: "LO4",
    type: "upload",
    accept: ".pdf,.docx",
    xp: 20,
    instructions: `<strong>Objectif :</strong> Documenter et tester votre programme.
    <br/><br/>
    <strong>Partie 1 — Plan de tests :</strong>
    <br/>Remplissez le tableau suivant (minimum 5 tests) :
    <table style="width:100%;border-collapse:collapse;margin:8px 0;font-size:11px">
      <tr style="background:#1e293b"><th style="padding:4px 8px;border:1px solid #334155;text-align:left">N°</th><th style="padding:4px 8px;border:1px solid #334155">Description</th><th style="padding:4px 8px;border:1px solid #334155">Entree</th><th style="padding:4px 8px;border:1px solid #334155">Resultat attendu</th><th style="padding:4px 8px;border:1px solid #334155">OK ?</th></tr>
      <tr><td style="padding:4px 8px;border:1px solid #334155">1</td><td style="padding:4px 8px;border:1px solid #334155">Creer un article valide</td><td style="padding:4px 8px;border:1px solid #334155">nom="PC", prix=999</td><td style="padding:4px 8px;border:1px solid #334155">Article cree</td><td style="padding:4px 8px;border:1px solid #334155">✅</td></tr>
      <tr><td style="padding:4px 8px;border:1px solid #334155">2</td><td style="padding:4px 8px;border:1px solid #334155">Prix negatif</td><td style="padding:4px 8px;border:1px solid #334155">prix=-50</td><td style="padding:4px 8px;border:1px solid #334155">Erreur / rejet</td><td style="padding:4px 8px;border:1px solid #334155">?</td></tr>
    </table>
    <br/>
    <strong>Partie 2 — Javadoc :</strong>
    <br/>• Ajoutez des commentaires <code>/** ... */</code> sur chaque classe et methode
    <br/>• Decrivez les <strong>@param</strong> et <strong>@return</strong>
    <br/>• Ajoutez <code>@author VotreNom</code> sur chaque classe
    <br/><br/>
    <strong>Partie 3 — Standards de codage :</strong>
    <br/>• Verifiez que vos noms suivent les conventions Java (camelCase, PascalCase)
    <br/>• Pas de code mort, pas de variables inutiles
    <br/><br/>
    <strong>Livrable :</strong> Document PDF ou DOCX avec le plan de tests + code commente.`,
  },
];

// ============================================
// MAIN COMPONENT
// ============================================
export default function ExerciseTechShop() {
  const { student } = useAuth();
  const [showSlides, setShowSlides] = useState(true);
  const [slideIdx, setSlideIdx] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepStatus, setStepStatus] = useState(STEPS.map(() => 'pending')); // pending, done
  const [textInput, setTextInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showOneCompiler, setShowOneCompiler] = useState(false);
  const [totalXP, setTotalXP] = useState(0);
  const fileRef = useRef(null);

  const step = STEPS[currentStep];
  const isTeacher = student?.role === 'teacher';

  // Submit step
  async function submitStep() {
    if (step.type === 'text' && !textInput.trim()) {
      setFeedback({ ok: false, msg: "Ecrivez votre pseudo-code d'abord !" });
      return;
    }

    // Mark as done
    const newStatus = [...stepStatus];
    newStatus[currentStep] = 'done';
    setStepStatus(newStatus);
    setTotalXP(xp => xp + step.xp);
    setFeedback({ ok: true, msg: `Etape validee ! +${step.xp} XP` });

    // Save to Supabase
    try {
      await supabase.from('cq_game_scores').insert({
        student_id: student?.id,
        game_id: 'techshop_step_' + currentStep,
        score: step.xp,
        duration_seconds: 0,
      });
    } catch (e) {}

    setTimeout(() => {
      setFeedback(null);
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }, 1500);
  }

  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Upload to Supabase Storage
    const path = `techshop/${student?.id || 'anon'}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    try {
      await supabase.storage.from('cours-documents').upload(path, file);
    } catch (err) {}

    setFeedback({ ok: true, msg: `Fichier "${file.name}" televerse !` });
    submitStep();
  }

  // ============================================
  // SLIDES OVERLAY
  // ============================================
  if (showSlides) {
    const slide = SLIDES[slideIdx];
    return (
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ maxWidth: 600, width: "100%", background: C.card, borderRadius: 16, border: "1px solid " + C.border, overflow: "hidden" }}>
          {/* Header */}
          <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid " + C.border }}>
            <span style={{ fontSize: 10, color: C.dimmed }}>{(slideIdx + 1) + " / " + SLIDES.length}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.gold }}>TechShop Geneve</span>
            <button onClick={() => setShowSlides(false)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 14 }}>✕ Fermer</button>
          </div>
          {/* Content */}
          <div style={{ padding: "20px 24px" }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: C.accent, marginBottom: 12 }}>{slide.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: slide.body }} style={{ color: C.text, lineHeight: 1.6 }} />
          </div>
          {/* Navigation */}
          <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", borderTop: "1px solid " + C.border }}>
            <button onClick={() => setSlideIdx(Math.max(0, slideIdx - 1))} disabled={slideIdx === 0}
              style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid " + C.border, background: "transparent", color: slideIdx > 0 ? C.text : C.dimmed, cursor: slideIdx > 0 ? "pointer" : "default", fontFamily: "inherit", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
              <ChevronLeft size={14} /> Precedent
            </button>
            {slideIdx < SLIDES.length - 1 ? (
              <button onClick={() => setSlideIdx(slideIdx + 1)}
                style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: C.accent, color: C.bg, cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                Suivant <ChevronRight size={14} />
              </button>
            ) : (
              <button onClick={() => setShowSlides(false)}
                style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: C.gold, color: C.bg, cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 700 }}>
                Commencer le projet ! 🚀
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // PROJECT VIEW
  // ============================================
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',sans-serif", padding: 16 }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.gold }}>TechShop Geneve 🖥️</div>
            <div style={{ fontSize: 11, color: C.muted }}>Exercice LO3 — Implementation d'un systeme complet en Java</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ padding: "4px 10px", borderRadius: 6, background: C.gold + "15", border: "1px solid " + C.gold + "40" }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: C.gold }}>{totalXP}</span>
              <span style={{ fontSize: 9, color: C.muted, marginLeft: 2 }}>XP</span>
            </div>
            <button onClick={() => { setShowSlides(true); setSlideIdx(0); }} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid " + C.border, background: "transparent", color: C.muted, cursor: "pointer", fontSize: 10 }}>📽️ Revoir slides</button>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
          {STEPS.map((s, i) => (
            <button key={i} onClick={() => (stepStatus[i] === 'done' || i <= currentStep) && setCurrentStep(i)}
              style={{
                flex: 1, padding: "8px 4px", borderRadius: 6, border: "none",
                background: stepStatus[i] === 'done' ? C.success + "20" : i === currentStep ? C.gold + "20" : C.card,
                cursor: (stepStatus[i] === 'done' || i <= currentStep) ? "pointer" : "default",
                opacity: i <= currentStep || stepStatus[i] === 'done' ? 1 : 0.4,
              }}>
              <div style={{ fontSize: 16 }}>{stepStatus[i] === 'done' ? '✅' : s.icon}</div>
              <div style={{ fontSize: 8, color: stepStatus[i] === 'done' ? C.success : i === currentStep ? C.gold : C.dimmed, fontWeight: 600, marginTop: 2 }}>{s.name.split(' ')[0]}</div>
            </button>
          ))}
        </div>

        {/* Current step */}
        <div style={{ background: C.card, borderRadius: 12, border: "1px solid " + C.border, overflow: "hidden" }}>
          {/* Step header */}
          <div style={{ padding: "14px 16px", borderBottom: "1px solid " + C.border, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 20 }}>{step.icon}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{"Etape " + (currentStep + 1) + " — " + step.name}</div>
                <div style={{ fontSize: 10, color: C.dimmed }}>{step.lo + " · " + step.xp + " XP"}</div>
              </div>
            </div>
            {stepStatus[currentStep] === 'done' && (
              <span style={{ padding: "3px 10px", borderRadius: 4, background: C.success + "20", color: C.success, fontSize: 10, fontWeight: 600 }}>Termine ✅</span>
            )}
          </div>

          {/* Instructions */}
          <div style={{ padding: "14px 16px" }}>
            <div dangerouslySetInnerHTML={{ __html: step.instructions }} style={{ fontSize: 12, color: C.text, lineHeight: 1.8 }} />
          </div>

          {/* Input area */}
          <div style={{ padding: "0 16px 16px" }}>
            {/* Upload */}
            {step.type === 'upload' && (
              <div>
                <input ref={fileRef} type="file" accept={step.accept} onChange={handleFileUpload} style={{ display: "none" }} />
                <button onClick={() => fileRef.current?.click()} style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 8,
                  border: "2px dashed " + C.accent + "40", background: C.accent + "08",
                  color: C.accent, cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600,
                }}><Upload size={14} /> Telecharger mon fichier ({step.accept})</button>
              </div>
            )}

            {/* Text input */}
            {step.type === 'text' && (
              <div>
                <textarea value={textInput} onChange={e => setTextInput(e.target.value)}
                  rows={12} placeholder="Ecrivez votre pseudo-code ici..."
                  style={{
                    width: "100%", padding: "12px", borderRadius: 8, border: "1px solid " + C.border,
                    background: C.code, color: C.codeTxt, fontFamily: "'Consolas',monospace",
                    fontSize: 12, resize: "vertical", boxSizing: "border-box",
                  }} />
                <button onClick={submitStep} style={{
                  marginTop: 8, padding: "10px 20px", borderRadius: 8, border: "none",
                  background: C.accent, color: C.bg, cursor: "pointer", fontFamily: "inherit",
                  fontSize: 12, fontWeight: 700,
                }}>Soumettre mon pseudo-code</button>
              </div>
            )}

            {/* Java editor (OneCompiler) */}
            {step.type === 'java' && (
              <div>
                <button onClick={() => setShowOneCompiler(!showOneCompiler)} style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 8,
                  border: "none", background: C.primary, color: C.text, cursor: "pointer",
                  fontFamily: "inherit", fontSize: 12, fontWeight: 700, marginBottom: 8,
                }}><Code size={14} /> {showOneCompiler ? "Masquer l'editeur" : "Ouvrir OneCompiler Java"}</button>
                
                {showOneCompiler && (
                  <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid " + C.border, marginBottom: 8 }}>
                    <iframe
                      src={"https://onecompiler.com/embed/java?theme=dark&hideTitle=true&hideLanguageSelection=true&code=" + encodeURIComponent(step.starterCode || '')}
                      style={{ width: "100%", height: 450, border: "none" }}
                      title="OneCompiler Java"
                    />
                  </div>
                )}

                {/* Smart hints */}
                <div style={{ background: C.gold + "10", borderRadius: 8, padding: "10px 12px", border: "1px solid " + C.gold + "30", marginBottom: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.gold, marginBottom: 4 }}>💡 Verifications automatiques :</div>
                  <div style={{ fontSize: 10, color: C.muted, lineHeight: 1.8 }}>
                    ✅ La classe Article a-t-elle des attributs prives ?<br/>
                    ✅ Le constructeur valide-t-il le prix (pas negatif) ?<br/>
                    ✅ Y a-t-il un getter/setter pour chaque attribut ?<br/>
                    ✅ La methode toString() est-elle definie ?<br/>
                    ✅ Le code compile sans erreur ?
                  </div>
                </div>

                <button onClick={submitStep} style={{
                  padding: "10px 20px", borderRadius: 8, border: "none",
                  background: C.success, color: "#fff", cursor: "pointer",
                  fontFamily: "inherit", fontSize: 12, fontWeight: 700,
                }}>J'ai termine cette etape ✅</button>
              </div>
            )}
          </div>

          {/* Feedback */}
          {feedback && (
            <div style={{ padding: "10px 16px", background: (feedback.ok ? C.success : C.danger) + "15", borderTop: "1px solid " + (feedback.ok ? C.success : C.danger) + "30" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: feedback.ok ? C.success : C.danger }}>{feedback.msg}</div>
            </div>
          )}
        </div>

        {/* Completion */}
        {stepStatus.every(s => s === 'done') && (
          <div style={{ marginTop: 16, background: C.success + "15", borderRadius: 12, padding: 20, border: "1px solid " + C.success + "30", textAlign: "center" }}>
            <div style={{ fontSize: 32 }}>🎉</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.success, marginTop: 8 }}>Projet TechShop termine !</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: C.gold, marginTop: 4 }}>{totalXP} XP gagnes</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>
              Vous avez complete les 6 etapes : Algorithme → UML → Pseudo-code → Code Java → Tests → Documentation
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
