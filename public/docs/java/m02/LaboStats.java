import java.util.Scanner;

/**
 * CODEQUEST - Module 02 : Boucles
 * Exercice : Le Labo de Statistiques
 * 
 * OBJECTIF : Pratiquer while, for, if/else, break, continue
 * 
 * CONSIGNES :
 * 1. Complétez les TODO
 * 2. Testez avec les cas en bas du fichier
 */
public class LaboStats {
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        int compteur = 0;
        int somme = 0;
        int max = 0;
        int min = 100;
        int nbDistinction = 0;
        int nbMerit = 0;
        int nbPass = 0;
        int nbRefer = 0;
        
        System.out.println("=== LABO DE STATISTIQUES ===");
        System.out.println("Entrez des notes (0-100), -1 pour terminer\n");
        
        // ============================================
        // TODO : Boucle while pour lire les notes
        // ============================================
        // Indice : utilisez une variable 'note' initialisée à 0
        // La boucle continue tant que note != -1
        // 
        // Dans la boucle :
        // 1. Lire la note avec sc.nextInt()
        // 2. Si note == -1 → break (sortir)
        // 3. Si note < 0 ou note > 100 → afficher erreur + continue
        // 4. Mettre à jour compteur, somme, max, min
        // 5. Compter les grades avec if/else if
        
        
        // ============================================
        // TODO : Afficher les résultats
        // ============================================
        // ATTENTION : vérifier compteur > 0 avant de calculer la moyenne
        // Pour la moyenne, utilisez : (double) somme / compteur
        // Le (double) est un CAST — il force la division décimale
        
        
        sc.close();
    }
}

/*
 * CAS DE TEST
 * 
 * Entrée : 85, 92, 45, 78, 100, -1
 * Résultat attendu :
 *   Nombre : 5
 *   Max : 100, Min : 45
 *   Moyenne : 80.0
 *   Distinction : 2, Merit : 1, Pass : 1, Refer : 1
 * 
 * Entrée : -1 (immédiat)
 * Résultat : "Aucune note entrée."
 * 
 * Entrée : 150, 85, -5, 70, -1
 * Résultat : 2 notes valides (85, 70), 2 erreurs ignorées
 */
