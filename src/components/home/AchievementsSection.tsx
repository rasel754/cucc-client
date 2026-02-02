import { Trophy, Medal, Award, Star } from "lucide-react";

const achievements = [
  {
    icon: Trophy,
    title: "ICPC Dhaka Regional",
    description: "Multiple teams qualified for ICPC Asia Regional",
    year: "2025",
    count: "5 Teams",
  },
  {
    icon: Medal,
    title: "National Hackathon",
    description: "1st Place at National Hackathon Bangladesh",
    year: "2025",
    count: "Winner",
  },
  {
    icon: Award,
    title: "CTF Competitions",
    description: "Top 10 in multiple national CTF events",
    year: "2024-25",
    count: "8 Awards",
  },
  {
    icon: Star,
    title: "Research Publications",
    description: "Published papers in IEEE and ACM conferences",
    year: "2024-25",
    count: "12 Papers",
  },
];

export function AchievementsSection() {
  return (
    <section className="section-padding bg-gradient-to-br from-secondary via-secondary/95 to-primary/90 text-secondary-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-cucc-cyber/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-6">
            <Trophy className="w-4 h-4 text-cucc-gold" />
            <span className="text-sm font-semibold text-secondary-foreground">Our Achievements</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Excellence in Every Field
          </h2>
          <p className="text-lg text-secondary-foreground/80 max-w-2xl mx-auto">
            Our members consistently excel at national and international competitions, 
            bringing pride to City University.
          </p>
        </div>

        {/* Achievements Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((achievement, index) => (
            <div
              key={achievement.title}
              className="p-6 rounded-2xl bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 hover:bg-primary-foreground/10 transition-all duration-300 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-cucc-gold/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <achievement.icon className="w-7 h-7 text-cucc-gold" />
              </div>
              
              <div className="text-sm text-cucc-gold font-semibold mb-1">{achievement.year}</div>
              <h3 className="font-display font-bold text-xl text-secondary-foreground mb-2">{achievement.title}</h3>
              <p className="text-secondary-foreground/70 text-sm mb-4">{achievement.description}</p>
              
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-cucc-gold/20 text-cucc-gold text-sm font-semibold">
                {achievement.count}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Stats */}
        <div className="mt-16 pt-12 border-t border-primary-foreground/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "150+", label: "Contests Participated" },
              { value: "75+", label: "Prizes Won" },
              { value: "30+", label: "Research Projects" },
              { value: "500+", label: "Certified Members" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-4xl md:text-5xl font-bold text-cucc-gold mb-2">{stat.value}</div>
                <div className="text-secondary-foreground/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
