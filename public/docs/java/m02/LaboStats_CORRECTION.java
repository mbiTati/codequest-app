import java.util.Scanner;

/**
 * CODEQUEST - Module 02 : Boucles
 * ⚠️ CORRECTION — NE PAS DISTRIBUER AUX ÉTUDIANTS
 */
public class LaboStats_CORRECTION {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        int compteur = 0, somme = 0, max = 0, min = 100;
        int nbDistinction = 0, nbMerit = 0, nbPass = 0, nbRefer = 0;
        
        System.out.println("=== LABO DE STATISTIQUES ===");
        System.out.println("Entrez des notes (0-100), -1 pour terminer\n");
        
        int note = 0;
        while (note != -1) {
            System.out.print("Note : ");
            note = sc.nextInt();
            
            if (note == -1) break;
            
            if (note < 0 || note > 100) {
                System.out.println("  → Note invalide ! (0-100)");
                continue;
            }
            
            compteur++;
            somme += note;
            if (note > max) max = note;
            if (note < min) min = note;
            
            if (note >= 90) nbDistinction++;
            else if (note >= 70) nbMerit++;
            else if (note >= 50) nbPass++;
            else nbRefer++;
        }
        
        System.out.println("\n=== RÉSULTATS ===");
        if (compteur == 0) {
            System.out.println("Aucune note entrée.");
        } else {
            double moyenne = (double) somme / compteur;
            System.out.println("Nombre de notes : " + compteur);
            System.out.println("Note max        : " + max);
            System.out.println("Note min        : " + min);
            System.out.println("Moyenne         : " + moyenne);
            System.out.println("\nRépartition :");
            System.out.println("  Distinction (90+) : " + nbDistinction);
            System.out.println("  Merit (70-89)     : " + nbMerit);
            System.out.println("  Pass (50-69)      : " + nbPass);
            System.out.println("  Refer (0-49)      : " + nbRefer);
        }
        sc.close();
    }
}
