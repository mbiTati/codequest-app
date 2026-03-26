import { useState } from 'react';
import { Code, Maximize2, Minimize2 } from 'lucide-react';

const C = {
  bg:"#0a0f1a",card:"#111827",accent:"#32E0C4",gold:"#F59E0B",
  text:"#e2e8f0",muted:"#94a3b8",border:"#1e293b",primary:"#0D7377",
};

// Map module IDs to their starter Java files
const STARTER_CODE = {
  m15: `public class Main {
    public static void main(String[] args) {
        // Variables & Types
        int age = 25;
        double prix = 19.99;
        boolean estActif = true;
        String nom = "Alice";
        
        System.out.println("Nom: " + nom);
        System.out.println("Age: " + age);
        System.out.println("Prix: " + prix);
        System.out.println("Actif: " + estActif);
        
        // TODO: Creer vos propres variables
        // TODO: Tester la division entiere (10 / 3)
        // TODO: Tester le casting (int)(9.99)
    }
}`,
  m01: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        int age = 20;
        
        // TODO: if/else pour verifier si majeur
        if (age >= 18) {
            System.out.println("Majeur");
        } else {
            System.out.println("Mineur");
        }
        
        // TODO: switch sur un jour de la semaine
        String jour = "lundi";
        switch (jour) {
            case "lundi": System.out.println("Debut de semaine"); break;
            case "vendredi": System.out.println("Bientot le weekend !"); break;
            default: System.out.println("Jour normal");
        }
    }
}`,
  m02: `public class Main {
    public static void main(String[] args) {
        // Boucle for
        System.out.println("=== Boucle for ===");
        for (int i = 0; i < 5; i++) {
            System.out.println("i = " + i);
        }
        
        // Boucle while
        System.out.println("\\n=== Boucle while ===");
        int n = 1;
        while (n <= 3) {
            System.out.println("n = " + n);
            n++;
        }
        
        // TODO: Creer une boucle do-while
        // TODO: Tester break et continue
        // TODO: Implementer Bubble Sort
    }
}`,
  m03: `public class Main {
    // TODO: Creer la classe Invention ici
    // - private String nom;
    // - private int annee;
    // - Constructeur
    // - Getter getNom()
    // - Methode decrire()
    
    public static void main(String[] args) {
        // Invention inv = new Invention("Telephone", 1876);
        // System.out.println(inv.decrire());
        System.out.println("Creez la classe Invention ci-dessus !");
    }
}`,
  m04: `import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        // String methods
        String texte = "Hello CodeQuest";
        System.out.println("Longueur: " + texte.length());
        System.out.println("Majuscule: " + texte.toUpperCase());
        System.out.println("Contient 'Code': " + texte.contains("Code"));
        
        // ArrayList
        ArrayList<String> liste = new ArrayList<>();
        liste.add("Java");
        liste.add("Python");
        liste.add("JavaScript");
        
        System.out.println("\\nListe: " + liste);
        System.out.println("Taille: " + liste.size());
        
        // TODO: Ajouter, supprimer, rechercher
    }
}`,
  m05: `public class Main {
    // Classe parent
    static class Invention {
        protected String nom;
        protected int annee;
        
        public Invention(String nom, int annee) {
            this.nom = nom;
            this.annee = annee;
        }
        
        public String decrire() {
            return nom + " (" + annee + ")";
        }
    }
    
    // TODO: Creer InventionLogicielle extends Invention
    // - attribut: String langage
    // - constructeur avec super()
    // - @Override decrire()
    
    public static void main(String[] args) {
        Invention inv = new Invention("Telephone", 1876);
        System.out.println(inv.decrire());
        
        // InventionLogicielle soft = new InventionLogicielle("Java", 1995, "James Gosling", "Java");
        // System.out.println(soft.decrire());
    }
}`,
  m07: `import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        // Securite : try-catch
        try {
            int n = Integer.parseInt("abc");
        } catch (NumberFormatException e) {
            System.out.println("Erreur: pas un nombre !");
        }
        
        // Null safety
        String texte = null;
        if (texte != null) {
            System.out.println(texte.length());
        } else {
            System.out.println("texte est null !");
        }
        
        // TODO: Ajouter validation d'entrees
        // TODO: Gerer les index hors bornes
        // TODO: Ajouter finally
    }
}`,
  m09: `public class Main {
    public static void main(String[] args) {
        // Ce programme a des BUGS !
        // Utilisez le debugger pour les trouver
        
        int[] notes = {15, 12, 18, 9, 14};
        
        // BUG 1: initialisation incorrecte
        int max = 0;  // Que se passe-t-il si toutes les notes sont negatives ?
        
        // BUG 2: off-by-one
        for (int i = 0; i <= notes.length; i++) {  // <= au lieu de <
            if (notes[i] > max) {
                max = notes[i];
            }
        }
        
        // BUG 3: division entiere
        int somme = 0;
        for (int i = 0; i < notes.length; i++) {
            somme += notes[i];
        }
        int moyenne = somme / notes.length;  // int/int = int !
        
        System.out.println("Max: " + max);
        System.out.println("Moyenne: " + moyenne);
    }
}`,
};

export default function JavaEditor({ moduleId, height = 450 }) {
  const [expanded, setExpanded] = useState(false);
  const code = STARTER_CODE[moduleId];
  
  if (!code) return null;

  // Encode the code for the iframe URL
  const encodedCode = encodeURIComponent(code);
  const iframeSrc = `https://onecompiler.com/embed/java?theme=dark&hideTitle=true&hideNew=true&hideLanguageSelection=true&listenToEvents=true`;

  return (
    <div style={{
      margin: "12px 0",
      borderRadius: 10,
      border: "1px solid " + C.border,
      overflow: "hidden",
      background: C.card,
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "6px 12px", background: C.primary + "20",
        borderBottom: "1px solid " + C.border,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600, color: C.accent }}>
          <Code size={14} /> Editeur Java (OneCompiler)
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => setExpanded(!expanded)} style={{
            display: "flex", alignItems: "center", gap: 3,
            padding: "3px 8px", borderRadius: 5, border: "1px solid " + C.border,
            background: "transparent", color: C.muted, cursor: "pointer",
            fontFamily: "inherit", fontSize: 9,
          }}>
            {expanded ? <><Minimize2 size={10}/> Reduire</> : <><Maximize2 size={10}/> Agrandir</>}
          </button>
        </div>
      </div>
      
      <iframe
        id={"oc-editor-" + moduleId}
        title="Java Editor"
        src={iframeSrc}
        width="100%"
        height={expanded ? 700 : height}
        frameBorder="0"
        style={{ display: "block" }}
        onLoad={() => {
          // Pre-populate with starter code after iframe loads
          setTimeout(() => {
            const iframe = document.getElementById("oc-editor-" + moduleId);
            if (iframe) {
              iframe.contentWindow.postMessage({
                eventType: 'populateCode',
                language: 'java',
                files: [{ name: "Main.java", content: code }]
              }, "*");
            }
          }, 2000);
        }}
      />
      
      <div style={{ padding: "4px 12px", fontSize: 9, color: C.muted, background: C.bg }}>
        Ecrivez votre code Java et cliquez Run. Les classes doivent etre dans le meme fichier (static inner classes pour les exercices).
      </div>
    </div>
  );
}
